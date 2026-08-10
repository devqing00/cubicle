import { NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In a real app, verify tutor authentication
    
    const { type, date, time, studentEmail, tier, reason } = data;

    if (!date || !time) {
      return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
    }

    const ref = `MAN-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const newDoc = {
      type, // 'booking' or 'block'
      date,
      time,
      studentEmail: studentEmail || null,
      tier: tier || null,
      reason: reason || null,
      reference: ref,
      status: type === "booking" ? "confirmed" : "blocked",
      createdAt: new Date().toISOString(),
    };

    await db.collection("bookings").add(newDoc);

    // If CALCOM_API_KEY is present, we would also push this to Cal.com API
    // e.g. creating an override or booking via API

    return NextResponse.json({ success: true, ref });
  } catch (error: unknown) {
    console.error("Failed to create manual entry:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create entry";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
