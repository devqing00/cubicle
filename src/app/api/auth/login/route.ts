import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const { getAdminAuth } = await import("@/lib/firebase-admin");
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 401 });
    }

    // Verify token and create session cookie lasting 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // We optionally verify the idToken before creating a session to ensure it was recently signed in.
    await getAdminAuth().verifyIdToken(idToken);
    
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn });

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
  } catch (error: any) {
    console.error("Login route FATAL error:", error);
    // Return a 500 with the exact error message to help debug on Vercel
    return NextResponse.json(
      { 
        error: "Failed to create session", 
        details: error?.message || String(error),
        stack: error?.stack
      }, 
      { status: 500 }
    );
  }
}
