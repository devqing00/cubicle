import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

import crypto from "crypto";
import { checkTrialEligibility, recordClaimedTrial, normalizeEmail, normalizePhone } from "@/lib/trial-fraud-prevention";

const CALCOM_API_KEY = process.env.CALCOM_API_KEY || "";

// Helper to convert any 12h/24h time format into clean 24h format (HH:mm)
function parseTo24Hour(timeStr: string): string {
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");
  const rawTime = clean.replace(/(AM|PM)/g, "").trim();

  let [hours, minutes] = rawTime.split(":").map((val) => parseInt(val, 10));
  if (isNaN(minutes)) minutes = 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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
      deviceId,
    } = body;

    if (!studentId || !scheduledDate || !scheduledTime || !tier) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const isTrial = tier === "trial";

    // 1. Fetch user doc to obtain verified profile email and phone
    const userSnap = await getAdminDb().collection("users").doc(studentId).get();
    const userData = userSnap.exists ? userSnap.data() : null;

    const targetEmail = studentEmail || userData?.email || "";
    const targetPhone = userData?.whatsappNumber || userData?.whatsapp || userData?.phoneNumber || "";

    // 2. Anti-Fraud Enforcement for Free Trial Bookings
    if (isTrial) {
      const eligibility = await checkTrialEligibility({
        studentId,
        email: targetEmail,
        phone: targetPhone,
        deviceId: deviceId || request.headers.get("x-device-fingerprint"),
      });

      if (!eligibility.eligible) {
        return NextResponse.json({ error: eligibility.reason }, { status: 400 });
      }
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

    const durationMinutes = isTrial ? 30 : tier === "standard" ? 60 : 90;

    const initialStatus = isTrial ? "confirmed" : "pending_payment";

    let meetLink = "";
    let meetingCode = "";
    let calcomBookingId: number | null = null;
    let calErrorMsg = "";

    // ONLY provision Cal.com / Google Meet immediately for FREE TRIAL bookings.
    // For paid sessions (standard/intensive), meeting link provisioning is deferred until Paystack payment is confirmed!
    if (isTrial) {
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
                email: studentEmail || "",
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

      // Fallback for Trial if Cal.com is unconfigured or failed
      if (!meetLink && process.env.NEXT_PUBLIC_TUTOR_MEET_LINK && process.env.NEXT_PUBLIC_TUTOR_MEET_LINK.trim().length > 0) {
        meetLink = process.env.NEXT_PUBLIC_TUTOR_MEET_LINK.trim();
        meetingCode = meetLink.split("/").pop() || ref;
      }

      // Guard for Trial: Must have valid meet link
      if (!meetLink) {
        return NextResponse.json({
          error: `Could not generate Google Meet room for this session: ${calErrorMsg || "Slot unavailable"}. Please select another time slot or try again.`
        }, { status: 400 });
      }

      if (!meetingCode && meetLink) {
        const parts = meetLink.split("/");
        meetingCode = parts[parts.length - 1] || ref;
      }
    }

    // 3. Store booking record in Firestore with guaranteed meetingCode
    const docRef = await getAdminDb().collection("bookings").add({
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

    // 4. Record permanent claim lock if this was a free trial session
    if (isTrial) {
      try {
        await recordClaimedTrial({
          studentId,
          studentEmail: targetEmail,
          normalizedEmail: normalizeEmail(targetEmail),
          normalizedPhone: normalizePhone(targetPhone),
          deviceId: deviceId || request.headers.get("x-device-fingerprint"),
          reference: ref,
        });
      } catch (claimErr) {
        console.error("Failed to record claimed trial lock:", claimErr);
      }
    }

    // 3. Dispatch in-app notifications
    try {
      // Notify Student
      await getAdminDb().collection("notifications").add({
        userId: studentId,
        title: "Session Booked",
        message: `Your ${tier} session has been scheduled for ${formattedSchedule || scheduledDate}. Ref: ${ref}`,
        type: "booking",
        link: "/dashboard/schedule",
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Notify Tutor
      await getAdminDb().collection("notifications").add({
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
