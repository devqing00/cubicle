import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireTutorUser } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const tutorUser = await requireTutorUser();
    if (!tutorUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { threadId } = await request.json();
    if (!threadId) {
      return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
    }

    const db = getAdminDb();
    const threadRef = db.collection("chats").doc(threadId);
    const docSnap = await threadRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Chat thread not found" }, { status: 404 });
    }

    // 1. Fetch and batch delete all messages in subcollection
    const messagesSnap = await threadRef.collection("messages").get();
    const batch = db.batch();
    
    messagesSnap.docs.forEach((docSnapItem) => {
      batch.delete(docSnapItem.ref);
    });

    // 2. Delete thread document
    batch.delete(threadRef);

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Chat thread and all message history permanently deleted.",
    });
  } catch (error: unknown) {
    console.error("Failed to delete chat thread:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
