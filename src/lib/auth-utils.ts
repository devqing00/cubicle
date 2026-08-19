import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "./firebase-admin";

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
    const decodedToken = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    console.error("Failed to verify session cookie:", error);
    return null;
  }
}

/**
 * Validates the current session cookie and verifies that the user is an authorized Tutor or Admin.
 * Returns decoded token if authorized, or null if unauthorized.
 */
export async function requireTutorUser() {
  const user = await getCurrentUser();
  if (!user) return null;

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  if (user.email && adminEmails.includes(user.email.toLowerCase())) {
    return user;
  }

  try {
    const userDoc = await getAdminDb().collection("users").doc(user.uid).get();
    if (userDoc.exists && userDoc.data()?.role === "tutor") {
      return user;
    }
  } catch (err) {
    console.error("Error checking tutor role in requireTutorUser:", err);
  }

  return null;
}

