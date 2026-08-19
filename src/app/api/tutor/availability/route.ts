import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireTutorUser } from "@/lib/auth-utils";

export async function GET() {
  try {
    const doc = await getAdminDb().collection("availability").doc("tutor_cubicle").get();
    if (doc.exists) {
      return NextResponse.json(doc.data());
    }
    return NextResponse.json({
      schedule: {
        1: { active: true, startTime: "09:00", endTime: "17:00" },
        2: { active: true, startTime: "09:00", endTime: "17:00" },
        3: { active: true, startTime: "09:00", endTime: "17:00" },
        4: { active: true, startTime: "09:00", endTime: "17:00" },
        5: { active: true, startTime: "09:00", endTime: "17:00" },
        6: { active: false, startTime: "09:00", endTime: "17:00" },
        0: { active: false, startTime: "09:00", endTime: "17:00" },
      },
      overrides: []
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch availability";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tutorUser = await requireTutorUser();
    if (!tutorUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { schedule, overrides } = await request.json();

    // 1. Persist to Firestore availability document
    await getAdminDb().collection("availability").doc("tutor_cubicle").set({
      schedule,
      overrides: overrides || [],
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to update availability:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update availability";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
