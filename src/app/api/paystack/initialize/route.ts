import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is not set.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Fetch booking details
    const bookingRef = getAdminDb().collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data();
    
    // Ensure the booking is pending payment or confirmed
    if (bookingData?.status !== "confirmed" && bookingData?.status !== "pending_payment") {
      return NextResponse.json({ error: "Booking is not in a valid state for payment" }, { status: 400 });
    }

    // Calculate price based on tier
    let amount = 0;
    if (bookingData.tier === "standard") {
      amount = 15000 * 100; // Paystack expects amount in Kobo (multiply by 100)
    } else if (bookingData.tier === "intensive") {
      amount = 25000 * 100;
    } else {
      return NextResponse.json({ error: "Invalid tier for payment" }, { status: 400 });
    }

    // Initialize Paystack Transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: bookingData.studentEmail || "student@example.com",
        amount,
        reference: bookingData.reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/history?payment=success`,
        metadata: {
          bookingId: bookingId,
          tier: bookingData.tier,
          custom_fields: [
            {
              display_name: "Booking Reference",
              variable_name: "booking_reference",
              value: bookingData.reference
            }
          ]
        }
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack initialization failed:", paystackData);
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
    }

    // Return the authorization URL to the client
    return NextResponse.json({ authorization_url: paystackData.data.authorization_url });

  } catch (error: unknown) {
    console.error("Error in Paystack initialization:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
