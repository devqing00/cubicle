import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { fulfillPaidBooking } from "@/lib/booking-fulfillment";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    // 1. Query Firestore for this booking
    const snapshot = await getAdminDb().collection("bookings").where("reference", "==", reference).get();
    if (snapshot.empty) {
      return NextResponse.json({ error: "Booking reference not found" }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // If already paid, return existing details immediately
    if (data.status === "paid" && data.meetLink) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        meetLink: data.meetLink,
        meetingCode: data.meetingCode,
        reference: data.reference,
      });
    }

    // 2. Verify transaction status directly with Paystack API
    if (PAYSTACK_SECRET_KEY) {
      const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const paystackData = await paystackRes.json();

      if (paystackRes.ok && paystackData.status && paystackData.data?.status === "success") {
        // Fulfill the booking: Provision Cal.com / Google Meet link and mark as paid
        const result = await fulfillPaidBooking(doc);
        return NextResponse.json({
          success: true,
          verified: true,
          meetLink: result.meetLink,
          meetingCode: result.meetingCode,
          reference: data.reference,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: paystackData.message || "Payment verification failed or payment is still pending.",
        }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Paystack secret key is unconfigured" }, { status: 500 });
  } catch (error: unknown) {
    console.error("Error verifying Paystack transaction:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
