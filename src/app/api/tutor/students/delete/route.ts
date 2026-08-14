import { NextResponse } from "next/server";
import { adminDb as db, adminAuth as auth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json();

    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json({ error: "Missing or invalid studentId" }, { status: 400 });
    }

    // 1. Delete from Firebase Auth if user exists
    try {
      await auth.deleteUser(studentId);
    } catch (authErr) {
      console.warn(`Auth user ${studentId} delete notice:`, authErr);
    }

    const batch = db.batch();

    // 2. Delete User Profile Document from Firestore
    const userRef = db.collection("users").doc(studentId);
    batch.delete(userRef);

    // 3. Delete all Notifications for this student
    const notifsSnap = await db.collection("notifications").where("userId", "==", studentId).get();
    notifsSnap.docs.forEach((doc: any) => batch.delete(doc.ref));

    // 4. Delete all Reviews submitted by this student
    const reviewsSnap = await db.collection("reviews").where("studentId", "==", studentId).get();
    reviewsSnap.docs.forEach((doc: any) => batch.delete(doc.ref));

    // 5. Delete Chat Thread & Messages
    const chatDocId = `chat_${studentId}_tutor_cubicle`;
    const chatRef = db.collection("chats").doc(chatDocId);
    const messagesSnap = await chatRef.collection("messages").get();
    messagesSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
    batch.delete(chatRef);

    // Also check for any generic chats where studentId matches
    const extraChatsSnap = await db.collection("chats").where("studentId", "==", studentId).get();
    extraChatsSnap.docs.forEach((doc: any) => {
      if (doc.id !== chatDocId) batch.delete(doc.ref);
    });

    // 6. Process Bookings: Preserve Financial Audits & Anonymize PII; Delete Unpaid/Pending
    const bookingsSnap = await db.collection("bookings").where("studentId", "==", studentId).get();
    bookingsSnap.docs.forEach((doc: any) => {
      const data = doc.data();
      const isPaidOrCompleted = data.status === "paid" || data.status === "completed" || !!data.paidAt;

      if (isPaidOrCompleted) {
        // Anonymize PII for financial accounting & audit compliance
        batch.update(doc.ref, {
          studentId: "DELETED_USER",
          studentName: "[Deleted Student]",
          studentEmail: "deleted@privacy.local",
          isFinancialAudit: true,
          anonymizedAt: new Date().toISOString(),
        });
      } else {
        // Unpaid, cancelled, or pending bookings are purged completely
        batch.delete(doc.ref);
      }
    });

    // Commit all deletions and updates atomically
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Student account, chats, notifications, and profile permanently cleared. Financial audit records anonymized.",
    });
  } catch (error: unknown) {
    console.error("Failed to delete student data:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
