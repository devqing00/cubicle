import { getAdminDb } from "@/lib/firebase-admin";

const CALCOM_API_KEY = process.env.CALCOM_API_KEY;

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

/**
 * Fulfills a paid booking: provisions Cal.com / Google Meet link, updates Firestore status to 'paid',
 * and sends real-time in-app notifications to student and tutor.
 * Safe and idempotent.
 */
export async function fulfillPaidBooking(bookingDoc: FirebaseFirestore.DocumentSnapshot) {
  const data = bookingDoc.data();
  if (!data) throw new Error("Booking data not found");

  if (data.status === "paid" && data.meetLink) {
    return {
      alreadyPaid: true,
      meetLink: data.meetLink,
      meetingCode: data.meetingCode,
      reference: data.reference,
    };
  }

  let meetLink = data.meetLink || "";
  let meetingCode = data.meetingCode || "";
  let calcomBookingId = data.calcomBookingId || null;

  // Compute UTC start time for Cal.com API
  const scheduledDate = data.scheduledDate || "";
  const scheduledTime = data.scheduledTime || "10:00";
  const timeZone = data.timeZone || "Africa/Lagos";

  if (!meetLink && scheduledDate) {
    const time24 = parseTo24Hour(scheduledTime);
    const [hourStr, minStr] = time24.split(":");
    const localHour = parseInt(hourStr, 10);
    const localMin = parseInt(minStr, 10);

    const [yearStr, monthStr, dayStr] = scheduledDate.split("-");
    const utcDate = new Date(Date.UTC(
      parseInt(yearStr, 10),
      parseInt(monthStr, 10) - 1,
      parseInt(dayStr, 10),
      localHour - 1, // WAT to UTC
      localMin,
      0
    ));

    // Try provisioning via Cal.com API v2
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
              name: data.studentName || "Student",
              email: data.studentEmail || "student@example.com",
              timeZone,
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
        }
      } catch (err) {
        console.error("Error creating Cal.com booking during payment fulfillment:", err);
      }
    }

    // Fallback to configured Tutor Meet Link
    if (!meetLink && process.env.NEXT_PUBLIC_TUTOR_MEET_LINK) {
      meetLink = process.env.NEXT_PUBLIC_TUTOR_MEET_LINK.trim();
      meetingCode = meetLink.split("/").pop() || data.reference;
    }

    if (!meetingCode && meetLink) {
      meetingCode = meetLink.split("/").pop() || data.reference;
    }
  }

  // Update Firestore record to 'paid' with verified meeting details
  const updateData: Record<string, any> = {
    status: "paid",
    paidAt: new Date().toISOString(),
  };

  if (meetLink) updateData.meetLink = meetLink;
  if (meetingCode) updateData.meetingCode = meetingCode;
  if (calcomBookingId) updateData.calcomBookingId = calcomBookingId;

  await bookingDoc.ref.update(updateData);

  // Dispatch real-time in-app notifications
  try {
    // Student Notification
    if (data.studentId) {
      await getAdminDb().collection("notifications").add({
        userId: data.studentId,
        title: "Payment Confirmed! ✅",
        message: `Your ${data.tier || "session"} lesson for ${data.formattedSchedule || data.scheduledDate} (Ref: ${data.reference}) is confirmed. Your meeting room link is ready!`,
        type: "booking",
        link: "/dashboard/schedule",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Tutor Notification
    await getAdminDb().collection("notifications").add({
      userId: "tutor_cubicle",
      title: `Payment Received: ${data.studentName || "Student"}`,
      message: `${data.studentName || "Student"} completed payment for their ${data.tier} session on ${data.formattedSchedule || data.scheduledDate}. Ref: ${data.reference}`,
      type: "booking",
      link: "/dashboard/schedule",
      read: false,
      createdAt: new Date().toISOString(),
    });
  } catch (notifErr) {
    console.warn("Fulfillment notification error:", notifErr);
  }

  return {
    alreadyPaid: false,
    meetLink,
    meetingCode,
    reference: data.reference,
  };
}
