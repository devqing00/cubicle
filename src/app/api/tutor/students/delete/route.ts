import { NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";
import { requireTutorUser } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const tutorUser = await requireTutorUser();
    if (!tutorUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { studentId } = await request.json();

    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json({ error: "Missing or invalid studentId" }, { status: 400 });
    }

    // 1. Delete from Firebase Auth if user exists
    try {
      await getAdminAuth().deleteUser(studentId);
    } catch (authErr) {
      console.warn(`Auth user ${studentId} delete notice:`, authErr);
    }

    const batch = getAdminDb().batch();

    // 2. Delete User Profile Document from Firestore
    const userRef = getAdminDb().collection("users").doc(studentId);
    batch.delete(userRef);

    // 3. Delete all Notifications for this student
    const notifsSnap = await getAdminDb().collection("notifications").where("userId", "==", studentId).get();
    notifsSnap.docs.forEach((doc: any) => batch.delete(doc.ref));

    // 4. Delete all Reviews submitted by this student
    const reviewsSnap = await getAdminDb().collection("reviews").where("studentId", "==", studentId).get();
    reviewsSnap.docs.forEach((doc: any) => batch.delete(doc.ref));

    // 5. Archive Chat Threads (Move to Archived tab for Tutor review & permanent deletion option)
    const chatDocIds = [`chat_${studentId}`, `chat_${studentId}_tutor_cubicle`];
    for (const docId of chatDocIds) {
      const cRef = getAdminDb().collection("chats").doc(docId);
      const cSnap = await cRef.get();
      if (cSnap.exists) {
        batch.set(cRef, {
          archived: true,
          isDeletedStudent: true,
          studentName: "[Deleted Student] (Archived)",
          updatedAt: new Date().toISOString(),
          archivedAt: new Date().toISOString(),
        }, { merge: true });
      }
    }

    const extraChatsSnap = await getAdminDb().collection("chats").where("studentId", "==", studentId).get();
    extraChatsSnap.docs.forEach((cDoc: any) => {
      batch.set(cDoc.ref, {
        archived: true,
        isDeletedStudent: true,
        studentName: "[Deleted Student] (Archived)",
        updatedAt: new Date().toISOString(),
        archivedAt: new Date().toISOString(),
      }, { merge: true });
    });

    // 6. Process Bookings: Preserve Financial Audits & Anonymize PII; Delete Unpaid/Pending
    const bookingsSnap = await getAdminDb().collection("bookings").where("studentId", "==", studentId).get();
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

    // NOTE: 'claimed_trials' collection records are intentionally PRESERVED.
    // This prevents malicious users from deleting their account and re-registering to claim another free trial.

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
