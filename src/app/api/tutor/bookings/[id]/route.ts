import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireTutorUser } from "@/lib/auth-utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tutorUser = await requireTutorUser();
    if (!tutorUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { status } = await request.json();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    await getAdminDb().collection("bookings").doc(id).update({
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
