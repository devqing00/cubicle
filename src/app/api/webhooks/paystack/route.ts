import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { fulfillPaidBooking } from "@/lib/booking-fulfillment";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(bodyText)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === "charge.success") {
      const reference = event.data.reference; // Could contain our booking CUB-XXXXX reference

      // 1. Query Firestore for this booking
      const snapshot = await getAdminDb().collection("bookings").where("reference", "==", reference).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();

        // IDEMPOTENCY GUARD: Check if already paid
        if (data.status === "paid") {
          console.log(`Booking ${reference} already marked as paid. Ignoring duplicate webhook.`);
          return new NextResponse("Already processed", { status: 200 });
        }

        // AMOUNT & CURRENCY SECURITY VALIDATION
        const expectedCurrency = "NGN";
        let expectedAmount = 0;
        if (data.tier === "standard") {
          expectedAmount = 15000 * 100;
        } else if (data.tier === "intensive") {
          expectedAmount = 25000 * 100;
        }

        if (event.data.currency !== expectedCurrency) {
          console.error(`Currency mismatch for ${reference}. Expected ${expectedCurrency}, got ${event.data.currency}`);
          return new NextResponse("Invalid Currency", { status: 400 });
        }

        if (event.data.amount !== expectedAmount) {
          console.error(`Amount mismatch for ${reference}. Expected ${expectedAmount}, got ${event.data.amount}`);
          return new NextResponse("Invalid Amount", { status: 400 });
        }

        // Fulfill booking: Provision Cal.com / Google Meet link, mark as paid, send notifications
        const result = await fulfillPaidBooking(doc);

        // Send WhatsApp notification
        if (data?.studentWhatsApp) {
          const meetLink = result.meetLink || "You can view your meeting link directly on your Cubicle schedule dashboard.";
          const msg = `Payment Successful! ✅\n\nYour booking on Cubicle is fully confirmed.\n\nBooking Reference: ${reference}\nMeeting Link: ${meetLink}\n\nThank you for choosing Cubicle!`;
          
          const phoneId = process.env.WHATSAPP_PHONE_ID;
          const token = process.env.WHATSAPP_ACCESS_TOKEN;
          if (phoneId && token && phoneId !== "your-phone-id-here") {
            const cleanPhone = data.studentWhatsApp.replace(/[\+\s\-]/g, '');
            try {
              await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: cleanPhone,
                  type: "text",
                  text: { body: msg },
                }),
              });
            } catch (err) {
              console.error("Failed to send WhatsApp message:", err);
            }
          }
        }
        
        console.log(`Payment successful and slot confirmed for reference: ${reference}`);
      } else {
        console.warn(`Webhook received for unknown reference: ${reference}`);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
