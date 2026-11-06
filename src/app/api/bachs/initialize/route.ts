import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { createBachsCheckoutSession } from "@/lib/bachs";

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const bookingRef = getAdminDb().collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data();
    if (!bookingData) {
      return NextResponse.json({ error: "Booking record is empty" }, { status: 400 });
    }

    // Ensure booking is in payable state
    if (bookingData.status !== "confirmed" && bookingData.status !== "pending_payment") {
      return NextResponse.json(
        { error: "Booking is not in a valid state for payment" },
        { status: 400 }
      );
    }

    // Strict server-side tier pricing authority (no client-side tampering)
    let amount = 0;
    if (bookingData.tier === "standard") {
      amount = 15000;
    } else if (bookingData.tier === "intensive") {
      amount = 25000;
    } else {
      return NextResponse.json({ error: "Invalid tier for payment" }, { status: 400 });
    }

    // Re-entrant mitigation: Reuse active pending checkout session if created < 15 mins ago
    if (
      bookingData.bachsCheckoutUrl &&
      bookingData.bachsSessionCreatedAt &&
      bookingData.status === "confirmed"
    ) {
      const createdTime = new Date(bookingData.bachsSessionCreatedAt).getTime();
      const elapsedMs = Date.now() - createdTime;
      if (elapsedMs < 15 * 60 * 1000) {
        return NextResponse.json({
          authorization_url: bookingData.bachsCheckoutUrl,
          reused: true,
        });
      }
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://cubicle-topaz.vercel.app"
        : "http://localhost:3000");

    const session = await createBachsCheckoutSession({
      customerEmail: bookingData.studentEmail || "student@example.com",
      customerName: bookingData.studentName || "Student",
      amount,
      currency: "NGN",
      reference: bookingData.reference,
      bookingId,
      tier: bookingData.tier,
      successUrl: `${appUrl}/dashboard/history?payment=success&reference=${bookingData.reference}&gateway=bachs`,
      cancelUrl: `${appUrl}/dashboard/schedule`,
      metadata: {
        bookingId,
        studentName: bookingData.studentName || "Student",
        studentEmail: bookingData.studentEmail,
        studentWhatsApp: bookingData.studentWhatsApp || "",
        scheduledDate: bookingData.scheduledDate || "",
        scheduledTime: bookingData.scheduledTime || "",
      },
    });

    // Record session metadata in Firestore
    await bookingRef.update({
      paymentGateway: "bachs",
      bachsSessionId: session.id,
      bachsCheckoutUrl: session.checkout_url,
      bachsSessionCreatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ authorization_url: session.checkout_url });
  } catch (error: unknown) {
    console.error("Error in Bachs payment initialization:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

