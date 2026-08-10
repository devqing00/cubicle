import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-utils";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Clear the session cookie
  response.cookies.delete(SESSION_COOKIE_NAME);

  // In a full implementation, you could also verify the cookie and use adminAuth.revokeRefreshTokens(uid) 
  // if you want to aggressively invalidate the session on the backend.

  return response;
}
