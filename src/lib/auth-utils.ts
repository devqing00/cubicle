import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export const SESSION_COOKIE_NAME = "cubicle-session";

/**
 * Validates the current session cookie and returns the user's decoded token.
 * Use this in Server Actions or React Server Components.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    console.error("Failed to verify session cookie:", error);
    return null;
  }
}
