import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 401 });
    }

    // Verify token and create session cookie lasting 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // We optionally verify the idToken before creating a session to ensure it was recently signed in.
    await adminAuth.verifyIdToken(idToken);
    
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true }, { status: 200 });
    
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 });
  }
}
