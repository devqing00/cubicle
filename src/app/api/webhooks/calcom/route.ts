import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import crypto from "crypto";
import { issueRefund } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-cal-signature-256");

    if (!signature) {
      return new NextResponse("Missing signature", { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.CALCOM_WEBHOOK_SECRET || "")
      .update(bodyText)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(bodyText);

    const triggerEvent = event.triggerEvent;
    const uid = event.payload?.uid;

    if (triggerEvent === "BOOKING_CREATED") {
      const snapshot = await getAdminDb().collection("bookings").where("calcomBookingId", "==", uid).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const { startTime, endTime, videoCallUrl } = event.payload || {};
        
        await doc.ref.update({
          startTime: startTime || null,
          endTime: endTime || null,
          meetLink: videoCallUrl || doc.data().meetLink || null,
          updatedAt: new Date().toISOString()
        });
        console.log(`Updated booking ${uid} with video link and times.`);
      }
    } else if (triggerEvent === "BOOKING_RESCHEDULED") {
      const snapshot = await getAdminDb().collection("bookings").where("calcomBookingId", "==", uid).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const { startTime, videoCallUrl } = event.payload || {};
        
        const updatePayload: Record<string, any> = { updatedAt: new Date().toISOString() };
        if (startTime) {
          const dateObj = new Date(startTime);
          updatePayload.scheduledDate = dateObj.toISOString().split("T")[0];
          updatePayload.scheduledTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
          updatePayload.formattedSchedule = dateObj.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
        }
        if (videoCallUrl) updatePayload.meetLink = videoCallUrl;

        await doc.ref.update(updatePayload);
        console.log(`Booking rescheduled in Firestore for Cal.com UID: ${uid}`);
      }
    } else if (triggerEvent === "BOOKING_CANCELLED" || triggerEvent === "BOOKING_REJECTED") {
      // 1. Query Firestore for this calcomBookingId
      const snapshot = await getAdminDb().collection("bookings").where("calcomBookingId", "==", uid).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const bookingData = doc.data();

        // If it was already paid, issue a refund
        if (bookingData.status === "paid" && bookingData.paystackReference) {
          console.log(`Cal.com webhook: Booking ${uid} cancelled. Issuing refund for ${bookingData.paystackReference}`);
          await issueRefund(bookingData.paystackReference);
        }

        // 2. Update status to 'cancelled'
        await doc.ref.update({ status: "cancelled", updatedAt: new Date().toISOString() });
        console.log(`Booking cancelled/rejected in Firestore for Cal.com UID: ${uid}`);
      } else {
        console.warn(`Webhook received for unknown Cal.com UID: ${uid}`);
      }
      
      console.log(`Booking cancelled/rejected in Cal.com: ${uid}`);
    } else if (triggerEvent === "MEETING_ENDED") {
      const snapshot = await getAdminDb().collection("bookings").where("calcomBookingId", "==", uid).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await doc.ref.update({ status: "completed", completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        console.log(`Meeting completed for Cal.com UID: ${uid}`);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Cal.com webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
