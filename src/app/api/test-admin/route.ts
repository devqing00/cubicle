import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, getFirebaseAdminApp } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const app = getFirebaseAdminApp();
    
    // Try to access a small operation
    const testDoc = await getAdminDb().collection("users").limit(1).get();
    
    return NextResponse.json({ 
      success: true, 
      appName: app.name,
      testDocSuccess: !testDoc.empty,
      message: "Admin SDK initialized successfully and can read from Firestore!"
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || String(error),
      stack: error?.stack,
      code: error?.code
    }, { status: 500 });
  }
}
