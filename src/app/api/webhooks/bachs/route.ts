import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { fulfillPaidBooking } from "@/lib/booking-fulfillment";
import { verifyBachsSignature } from "@/lib/bachs";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-bachs-signature") ||
      req.headers.get("x-bachs-signature-v2");
    const timestamp = req.headers.get("x-bachs-timestamp");

    // 1. Cryptographic HMAC-SHA256 signature and replay defense
    if (!verifyBachsSignature(rawBody, signature, timestamp)) {
      console.error("Bachs webhook rejected: Invalid signature or expired timestamp.");
      return new NextResponse("Invalid signature or expired timestamp", { status: 401 });
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return new NextResponse("Malformed JSON", { status: 400 });
    }

    const eventType = (event.type || event.event || "").toLowerCase();
    const data = event.data?.object || event.data || {};

    const successEvents = [
      "collection.succeeded",
      "checkout.completed",
      "payment.succeeded",
      "charge.success",
    ];

    if (successEvents.includes(eventType)) {
      const metadata = data.metadata || {};
      const reference =
        metadata.reference ||
        data.reference ||
        metadata.booking_reference;

      if (!reference) {
        console.warn("Bachs webhook: Event received without reference", eventType);
        return new NextResponse("No reference in payload", { status: 200 });
      }

      // 2. Query Firestore for this booking
      const snapshot = await getAdminDb()
        .collection("bookings")
        .where("reference", "==", reference)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const bookingData = doc.data();

        // 3. IDEMPOTENCY GUARD: Ignore if already marked as paid
        if (bookingData.status === "paid") {
          console.log(`Booking ${reference} is already marked as paid. Webhook retry ignored.`);
          return new NextResponse("Already processed", { status: 200 });
        }

        // 4. AMOUNT & CURRENCY VALIDATION
        const expectedCurrency = "NGN";
        let expectedAmount = 0;
        if (bookingData.tier === "standard") {
          expectedAmount = 15000;
        } else if (bookingData.tier === "intensive") {
          expectedAmount = 25000;
        }

        const actualAmount = Number(
          data.amount ||
          data.pricing?.amount ||
          data.pricing?.unit_amount ||
          expectedAmount
        );

        if (expectedAmount > 0 && actualAmount < expectedAmount) {
          console.error(
            `Amount mismatch for ${reference}. Expected >= ${expectedAmount}, received ${actualAmount}`
          );
          await doc.ref.update({
            status: "payment_mismatch",
            paymentMismatchReason: `Expected ${expectedAmount}, received ${actualAmount}`,
            updatedAt: new Date().toISOString(),
          });
          return new NextResponse("Amount Mismatch", { status: 400 });
        }

        // 5. Fulfill booking: Cal.com / Google Meet provisioning & Firestore status update
        const result = await fulfillPaidBooking(doc);

        // Record Bachs metadata onto the booking
        await doc.ref.update({
          paymentGateway: "bachs",
          bachsEventId: event.id || event.event_id || null,
          bachsPaymentStatus: "success",
          paidAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // 6. Send WhatsApp confirmation notification
        if (bookingData?.studentWhatsApp) {
          const meetLink =
            result.meetLink ||
            "You can view your meeting link directly on your Cubicle schedule dashboard.";
          const msg = `Payment Successful! ✅\n\nYour booking on Cubicle is fully confirmed.\n\nBooking Reference: ${reference}\nMeeting Link: ${meetLink}\n\nThank you for choosing Cubicle!`;

          const phoneId = process.env.WHATSAPP_PHONE_ID;
          const token = process.env.WHATSAPP_ACCESS_TOKEN;
          if (phoneId && token && phoneId !== "your-phone-id-here") {
            const cleanPhone = bookingData.studentWhatsApp.replace(/[\+\s\-]/g, "");
            try {
              await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
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

        console.log(`Bachs: Payment successful and slot confirmed for reference: ${reference}`);
      } else {
        console.warn(`Bachs webhook received for unknown reference: ${reference}`);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Bachs webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

