import { NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import crypto from "crypto";

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

    if (triggerEvent === "BOOKING_CANCELLED" || triggerEvent === "BOOKING_REJECTED") {
      // 1. Query Firestore for this calcomBookingId
      const snapshot = await db.collection("bookings").where("calcomBookingId", "==", uid).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        // 2. Update status to 'cancelled'
        await doc.ref.update({ status: "cancelled" });
        console.log(`Booking cancelled/rejected in Firestore for Cal.com UID: ${uid}`);
      } else {
        console.warn(`Webhook received for unknown Cal.com UID: ${uid}`);
      }
      
      console.log(`Booking cancelled/rejected in Cal.com: ${uid}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Cal.com webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
