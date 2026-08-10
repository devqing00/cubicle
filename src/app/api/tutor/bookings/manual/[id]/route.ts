import { NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { issueRefund } from "@/lib/paystack";

async function sendWhatsAppMessage(to: string, text: string) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  
  if (!phoneId || !token || phoneId === "your-phone-id-here") {
    console.warn("WhatsApp credentials not configured. Skipping message to", to);
    return;
  }

  // Basic cleanup of phone number (remove + and spaces)
  const cleanPhone = to.replace(/[\+\s\-]/g, '');

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "text",
        text: { body: text },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("WhatsApp API error:", errorData);
    }
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status } = await request.json();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    // Fetch booking to get details
    const bookingRef = db.collection("bookings").doc(id);
    const bookingDoc = await bookingRef.get();
    
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    const bookingData = bookingDoc.data();

    const isTrial = bookingData?.tier === "trial";
    const finalStatus = (status === "confirmed" && isTrial) ? "paid" : status;

    // Handle refunds if rejecting a paid booking
    if (status === "cancelled" && bookingData?.status === "paid" && bookingData?.paystackReference) {
      console.log(`Rejecting paid booking ${id}. Issuing refund...`);
      await issueRefund(bookingData.paystackReference);
    }

    await bookingRef.update({
      status: finalStatus,
      updatedAt: new Date().toISOString(),
      ...(finalStatus === "paid" && { paidAt: new Date().toISOString() })
    });

    // Send WhatsApp notification
    if (bookingData?.studentWhatsApp) {
      const directContactLink = "https://wa.me/234XXXXXXXXXX"; // Replace with actual business number
      if (status === "confirmed") {
        if (isTrial) {
          const meetLink = bookingData.meetLink || bookingData.responses?.meetLink || "You will receive the meeting link shortly from your instructor.";
          const msg = `Hi ${bookingData.studentName || 'there'}!\n\nYour Free Trial booking on Cubicle has been *confirmed*! 🎉\n\nBooking Reference: ${bookingData.reference}\nMeeting Link: ${meetLink}\n\nIf you have any questions, you can message your tutor directly here: ${directContactLink}\n\nThank you for choosing Cubicle!`;
          await sendWhatsAppMessage(bookingData.studentWhatsApp, msg);
        } else {
          const msg = `Hi ${bookingData.studentName || 'there'}!\n\nYour music lesson booking on Cubicle has been *confirmed* by the instructor. 🎉\n\nBooking Reference: ${bookingData.reference}\n\nPlease proceed to make your payment to secure your spot. We will send you the class link shortly after payment.\n\nIf you have any questions, you can message your tutor directly here: ${directContactLink}\n\nThank you for choosing Cubicle!`;
          await sendWhatsAppMessage(bookingData.studentWhatsApp, msg);
        }
      } else if (status === "cancelled") {
        let msg = `Hi ${bookingData.studentName || 'there'},\n\nUnfortunately, your lesson booking (${bookingData.reference}) was declined by the instructor due to unavailability.`;
        if (bookingData.status === "paid" && bookingData.paystackReference) {
          msg += `\n\nWe have automatically issued a full refund of your payment via Paystack. It should reflect in your account shortly.`;
        }
        await sendWhatsAppMessage(bookingData.studentWhatsApp, msg);
      } else if (status === "completed") {
        const msg = `Hi ${bookingData.studentName || 'there'}!\n\nYour lesson (${bookingData.reference}) is now complete! 🎶\n\nWe hope you had a great time. Don't forget to practice and book your next session soon!\n\n- The Cubicle Team`;
        await sendWhatsAppMessage(bookingData.studentWhatsApp, msg);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to update booking status:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update booking";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
