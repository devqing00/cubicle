import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getCurrentUser, requireTutorUser } from "@/lib/auth-utils";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const isTutor = await requireTutorUser();

    if (!user && !isTutor) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    const bookingRef = getAdminDb().collection("bookings").doc(id);
    const bookingDoc = await bookingRef.get();
    
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    const bookingData = bookingDoc.data();

    // Verify ownership (or tutor role)
    if (!isTutor && user?.uid !== bookingData?.studentId) {
      return NextResponse.json({ error: "Forbidden: You do not own this booking" }, { status: 403 });
    }

    // Allow student to cancel pending_payment or confirmed bookings
    if (bookingData?.status === "completed") {
      return NextResponse.json({ error: "Cannot cancel a completed booking" }, { status: 400 });
    }

    await bookingRef.update({
      status: "cancelled",
      cancelledAt: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete booking:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete booking";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
