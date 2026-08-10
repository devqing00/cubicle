import { NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status } = await request.json();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In a real app, we would verify the tutor's session token here.
    // For this prototype, we'll assume the request is authenticated since the UI only shows this to tutors.
    
    await db.collection("bookings").doc(id).update({
      status,
      updatedAt: new Date().toISOString()
    });

    // If status is cancelled or completed, we might want to sync with Cal.com
    // if we stored the calcomBookingId.
    // For now, we'll just update Firebase.

    return NextResponse.json({ success: true, status });
  } catch (error: unknown) {
    console.error("Failed to update booking status:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update booking";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
