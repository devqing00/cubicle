import "server-only";
import { getAdminDb } from "./firebase-admin";

/**
 * Normalizes email address to prevent alias & dot-trick fraud.
 * e.g., "J.o.h.n+trial1@gmail.com" -> "john@gmail.com"
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== "string") return "";
  const cleaned = email.trim().toLowerCase();
  const parts = cleaned.split("@");
  if (parts.length !== 2) return cleaned;

  let [username, domain] = parts;

  // Strip anything after '+' for alias emails
  if (username.includes("+")) {
    username = username.split("+")[0];
  }

  // Gmail & Googlemail treat dots as non-existent in username
  if (domain === "gmail.com" || domain === "googlemail.com") {
    username = username.replace(/\./g, "");
    domain = "gmail.com";
  }

  return `${username}@${domain}`;
}

/**
 * Normalizes phone/WhatsApp number to numbers-only string.
 * e.g., "+234 (801) 234-5678" -> "2348012345678"
 */
export function normalizePhone(phone?: string | null): string {
  if (!phone || typeof phone !== "string") return "";
  return phone.replace(/[^0-9]/g, "");
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
}

/**
 * Server-side check to determine if a student, email, phone, or device has already claimed a free trial.
 */
export async function checkTrialEligibility(params: {
  studentId: string;
  email: string;
  phone?: string | null;
  deviceId?: string | null;
}): Promise<EligibilityResult> {
  const { studentId, email, phone, deviceId } = params;
  const normEmail = normalizeEmail(email);
  const normPhone = normalizePhone(phone);

  const db = getAdminDb();
  const trialsRef = db.collection("claimed_trials");

  // 1. Check by studentId
  if (studentId) {
    const studentSnap = await trialsRef.where("studentId", "==", studentId).get();
    if (!studentSnap.empty) {
      return {
        eligible: false,
        reason: "You have already claimed your Free Trial session on this account.",
      };
    }
  }

  // 2. Check by Normalized Email (catches gmail dot tricks & plus aliases)
  if (normEmail) {
    const emailSnap = await trialsRef.where("normalizedEmail", "==", normEmail).get();
    if (!emailSnap.empty) {
      return {
        eligible: false,
        reason: "A Free Trial has already been claimed using this email address or an alias of it.",
      };
    }
  }

  // 3. Check by Normalized Phone/WhatsApp (if provided)
  if (normPhone && normPhone.length >= 7) {
    const phoneSnap = await trialsRef.where("normalizedPhone", "==", normPhone).get();
    if (!phoneSnap.empty) {
      return {
        eligible: false,
        reason: "A Free Trial has already been registered with this WhatsApp/phone number.",
      };
    }
  }

  // 4. Check by Persistent Device Fingerprint (if provided)
  if (deviceId && deviceId.length > 5) {
    const deviceSnap = await trialsRef.where("deviceId", "==", deviceId).get();
    if (!deviceSnap.empty) {
      return {
        eligible: false,
        reason: "A Free Trial has already been claimed on this browser or device.",
      };
    }
  }

  return { eligible: true };
}

/**
 * Permanently records a claimed free trial in Firestore.
 * This record is NEVER deleted, ensuring trial locks persist even if account is deleted.
 */
export async function recordClaimedTrial(params: {
  studentId: string;
  studentEmail: string;
  normalizedEmail: string;
  normalizedPhone: string;
  deviceId?: string | null;
  reference: string;
}): Promise<void> {
  const { studentId, studentEmail, normalizedEmail, normalizedPhone, deviceId, reference } = params;

  await getAdminDb().collection("claimed_trials").add({
    studentId,
    studentEmail,
    normalizedEmail,
    normalizedPhone,
    deviceId: deviceId || null,
    reference,
    claimedAt: new Date().toISOString(),
  });

  console.log(`[Anti-Fraud] Permanently logged Free Trial claim for student ${studentId} (${normalizedEmail})`);
}
