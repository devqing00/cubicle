import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { fulfillPaidBooking } from "@/lib/booking-fulfillment";
import { getBachsCheckoutSession } from "@/lib/bachs";

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    // 1. Look up booking in Firestore by reference
    const snapshot = await getAdminDb()
      .collection("bookings")
      .where("reference", "==", reference)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Booking reference not found" }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // 2. Fast-path: Already confirmed and fulfilled
    if (data.status === "paid" && data.meetLink) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        meetLink: data.meetLink,
        meetingCode: data.meetingCode,
        reference: data.reference,
      });
    }

    // 3. Remote Verification with Bachs API
    const sessionId = data.bachsSessionId || reference;
    if (sessionId) {
      try {
        const sessionInfo = await getBachsCheckoutSession(sessionId);
        const paymentStatus = (
          sessionInfo.status ||
          sessionInfo.payment_status ||
          sessionInfo.state ||
          ""
        ).toLowerCase();

        const isSuccess = ["completed", "paid", "succeeded", "success"].includes(paymentStatus);

        if (isSuccess) {
          // Fulfill the booking: provision Cal.com / Google Meet link and mark as paid
          const result = await fulfillPaidBooking(doc);
          return NextResponse.json({
            success: true,
            verified: true,
            meetLink: result.meetLink,
            meetingCode: result.meetingCode,
            reference: data.reference,
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              status: paymentStatus,
              error: sessionInfo.message || "Payment is still processing or was not completed.",
            },
            { status: 400 }
          );
        }
      } catch (apiErr: unknown) {
        console.error("Bachs session status fetch error:", apiErr);
        // If query fails, fall back to current database state
        return NextResponse.json(
          {
            success: false,
            error: "Unable to verify with payment gateway. Please check back shortly.",
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: "Booking does not have an associated Bachs session ID" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Error verifying Bachs transaction:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

