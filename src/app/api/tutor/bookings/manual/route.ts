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
    const meetLink = process.env.NEXT_PUBLIC_TUTOR_MEET_LINK && process.env.NEXT_PUBLIC_TUTOR_MEET_LINK.trim().length > 0
      ? process.env.NEXT_PUBLIC_TUTOR_MEET_LINK.trim()
      : "";

    if (!meetLink) {
      return NextResponse.json({ error: "No tutor Google Meet link configured. Please set your meeting link in Settings." }, { status: 400 });
    }

    const meetingCode = meetLink.includes("meet.google.com/")
      ? meetLink.split("meet.google.com/")[1]?.split("?")[0]
      : meetLink.split("/").pop() || ref;

    const newDoc = {
      type, // 'booking' or 'block'
      date,
      time,
      studentEmail: studentEmail || null,
      tier: tier || null,
      reason: reason || null,
      reference: ref,
      meetLink: type === "booking" ? meetLink : null,
      meetingCode: type === "booking" ? meetingCode : null,
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
