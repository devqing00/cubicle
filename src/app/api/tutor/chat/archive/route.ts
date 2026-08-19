import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireTutorUser } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const tutorUser = await requireTutorUser();
    if (!tutorUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { threadId, archived = true } = await request.json();
    if (!threadId) {
      return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
    }

    const threadRef = getAdminDb().collection("chats").doc(threadId);
    const docSnap = await threadRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Chat thread not found" }, { status: 404 });
    }

    await threadRef.update({
      archived: Boolean(archived),
      archivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: archived ? "Thread archived successfully" : "Thread unarchived successfully",
    });
  } catch (error: unknown) {
    console.error("Failed to update chat thread archive status:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
