import { NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";

const CALCOM_API_KEY = process.env.CALCOM_API_KEY;

// Helper to convert any 12h/24h time format into clean 24h format (HH:mm)
function parseTo24Hour(timeStr: string): string {
  if (!timeStr) return "10:00";
  const trimmed = timeStr.trim();
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed) && !trimmed.toLowerCase().includes("m")) {
    const [h, m] = trimmed.split(":");
    return `${h.padStart(2, '0')}:${m}`;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const modifier = match[3]?.toUpperCase();

    if (modifier === "PM" && hour < 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }

  return "10:00";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentEmail,
      tier,
      scheduledDate,
      scheduledTime,
      formattedSchedule,
      timeZone = "Africa/Lagos",
    } = body;

    if (!studentId || !scheduledDate || !scheduledTime || !tier) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    // Generate unique Cubicle reference
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    const ref = `CUB-${hex}`;

    // Calculate start and end ISO times safely
    const time24 = parseTo24Hour(scheduledTime);
    // WAT (Africa/Lagos) is UTC+1. Compute exact UTC timestamp for Cal.com API
    const [hourStr, minStr] = time24.split(":");
    const localHour = parseInt(hourStr, 10);
    const localMin = parseInt(minStr, 10);

    // Create Date anchored in UTC for WAT (subtract 1 hour for UTC)
    const [yearStr, monthStr, dayStr] = scheduledDate.split("-");
    const utcDate = new Date(Date.UTC(
      parseInt(yearStr, 10),
      parseInt(monthStr, 10) - 1,
      parseInt(dayStr, 10),
      localHour - 1, // WAT to UTC
      localMin,
      0
    ));

    const durationMinutes = tier === "trial" ? 30 : tier === "standard" ? 60 : 90;

    let meetLink = process.env.NEXT_PUBLIC_TUTOR_MEET_LINK || "";
    let meetingCode = "";
    let calcomBookingId: number | null = null;

    let calErrorMsg = "";

    // 1. Programmatically provision dedicated Google Meet room via Cal.com API v2
    if (CALCOM_API_KEY && CALCOM_API_KEY.startsWith("cal_")) {
      try {
        const calRes = await fetch("https://api.cal.com/v2/bookings", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${CALCOM_API_KEY}`,
            "cal-api-version": "2024-08-13",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start: utcDate.toISOString(),
            attendee: {
              name: studentName || "Student",
              email: studentEmail || "adetayoalexander12@gmail.com",
              timeZone: timeZone || "Africa/Lagos",
            },
            eventTypeSlug: "30min",
            username: "devqing",
            location: "integrations:google:meet",
          }),
        });

        const calData = await calRes.json();

        if (calRes.ok && calData.data) {
          const bookingData = calData.data;
          calcomBookingId = bookingData.id || null;
          meetLink = bookingData.meetingUrl || bookingData.location || "";
          if (meetLink.includes("meet.google.com/")) {
            meetingCode = meetLink.split("meet.google.com/")[1]?.split("?")[0] || bookingData.uid || "";
          } else {
            meetingCode = bookingData.uid || "";
          }
        } else {
          const rawMsg = calData.error?.message || calData.message || "Selected slot is unavailable or conflicts with existing schedule.";
          if (rawMsg.toLowerCase().includes("in the past")) {
            calErrorMsg = "The selected time slot has already passed for today. Please pick a future time slot.";
          } else if (rawMsg.toLowerCase().includes("already has booking") || rawMsg.toLowerCase().includes("not available")) {
            calErrorMsg = "This time slot is already booked on the instructor's calendar. Please select another slot.";
          } else {
            calErrorMsg = rawMsg;
          }
          console.warn("Cal.com v2 booking creation rejected:", calErrorMsg);
        }
      } catch (calErr: unknown) {
        calErrorMsg = calErr instanceof Error ? calErr.message : "Failed to communicate with scheduling service.";
        console.error("Error communicating with Cal.com v2 API:", calErr);
      }
    }

    // 2. Fallback to Tutor's configured dedicated Google Meet link if Cal.com is unconfigured or failed
    if (!meetLink && process.env.NEXT_PUBLIC_TUTOR_MEET_LINK && process.env.NEXT_PUBLIC_TUTOR_MEET_LINK.trim().length > 0) {
      meetLink = process.env.NEXT_PUBLIC_TUTOR_MEET_LINK.trim();
      meetingCode = meetLink.split("/").pop() || ref;
    }

    // 3. STRICT GUARD: If a valid meeting link could NOT be generated, FAIL the request! Do NOT create a booking with dummy links!
    if (!meetLink) {
      return NextResponse.json({
        error: `Could not generate Google Meet room for this session: ${calErrorMsg || "Slot unavailable"}. Please select another time slot or try again.`
      }, { status: 400 });
    }

    // If meetingCode is still empty, extract from URL
    if (!meetingCode && meetLink) {
      const parts = meetLink.split("/");
      meetingCode = parts[parts.length - 1] || ref;
    }

    const isTrial = tier === "trial";
    const initialStatus = isTrial ? "confirmed" : "pending_payment";

    // 3. Store booking record in Firestore with guaranteed meetingCode
    const docRef = await db.collection("bookings").add({
      studentId,
      studentName: studentName || "Student",
      studentEmail: studentEmail || "",
      reference: ref,
      tier,
      scheduledDate,
      scheduledTime,
      formattedSchedule,
      meetLink,
      meetingCode,
      calcomBookingId,
      status: initialStatus,
      createdAt: new Date().toISOString(),
    });

    // 3. Dispatch in-app notifications
    try {
      // Notify Student
      await db.collection("notifications").add({
        userId: studentId,
        title: "Session Booked",
        message: `Your ${tier} session has been scheduled for ${formattedSchedule || scheduledDate}. Ref: ${ref}`,
        type: "booking",
        link: "/dashboard/schedule",
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Notify Tutor
      await db.collection("notifications").add({
        userId: "tutor_cubicle",
        title: `New Booking: ${studentName || "Student"}`,
        message: `${studentName || "Student"} booked a ${tier} session for ${formattedSchedule || scheduledDate}. Ref: ${ref}`,
        type: "booking",
        link: "/dashboard/schedule",
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (notifErr) {
      console.warn("Notification dispatch warning:", notifErr);
    }

    return NextResponse.json({
      id: docRef.id,
      reference: ref,
      tier,
      scheduledDate,
      scheduledTime,
      formattedSchedule,
      meetLink,
      meetingCode,
      status: initialStatus,
    });

  } catch (error: unknown) {
    console.error("Failed to create booking:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
