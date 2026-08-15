import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
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
