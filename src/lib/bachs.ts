import crypto from "crypto";

const BACHS_API_KEY = process.env.BACHS_API_KEY || "";
const BACHS_WEBHOOK_SECRET = process.env.BACHS_WEBHOOK_SECRET || "";
const BACHS_ENV = (process.env.BACHS_ENV || "production").toLowerCase().trim();

export const BACHS_BASE_URL =
  BACHS_ENV === "production" || BACHS_API_KEY.startsWith("sk_live_")
    ? "https://api.bachs.io"
    : "https://sandbox-api.bachs.io";

export const WEBHOOK_TOLERANCE_SECONDS = 300; // 5 minutes drift allowed

export interface CreateCheckoutSessionParams {
  customerEmail: string;
  customerName?: string;
  amount: number; // In main currency unit, e.g. 15000 for NGN
  currency?: string;
  reference: string;
  bookingId: string;
  tier: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, unknown>;
}

export interface BachsCheckoutSessionResponse {
  id: string;
  session_id?: string;
  checkout_url: string;
  authorization_url?: string;
  url?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Creates a hosted Bachs checkout session for lesson bookings.
 */
export async function createBachsCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<BachsCheckoutSessionResponse> {
  if (!BACHS_API_KEY) {
    throw new Error("BACHS_API_KEY is not configured in environment variables.");
  }

  const currency = (params.currency || "NGN").toUpperCase();
  const formattedAmount = `${Number(params.amount).toFixed(2)}`;

  const payload = {
    pricing: {
      currency,
      amount: formattedAmount,
    },
    customer: {
      email: params.customerEmail,
      name: params.customerName || "Cubicle Student",
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      reference: params.reference,
      bookingId: params.bookingId,
      tier: params.tier,
      provider: "cubicle",
      ...(params.metadata || {}),
    },
  };

  const response = await fetch(`${BACHS_BASE_URL}/v1/checkout-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BACHS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || data.error || response.statusText || "Bachs session creation failed";
    console.error("Bachs checkout creation error:", data);
    throw new Error(`Bachs checkout error: ${errorMsg}`);
  }

  const checkoutUrl = data.checkout_url || data.url || data.authorization_url;
  if (!checkoutUrl) {
    throw new Error("Bachs response did not return a valid checkout authorization URL.");
  }

  return {
    ...data,
    id: data.id || data.session_id || params.reference,
    checkout_url: checkoutUrl,
  };
}

/**
 * Retrieves a checkout session status from the Bachs API.
 */
export async function getBachsCheckoutSession(sessionId: string): Promise<Record<string, any>> {
  if (!BACHS_API_KEY) {
    throw new Error("BACHS_API_KEY is not configured.");
  }

  const response = await fetch(`${BACHS_BASE_URL}/v1/checkout-sessions/${encodeURIComponent(sessionId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BACHS_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Failed to retrieve Bachs session ${sessionId}`);
  }

  return data;
}

/**
 * Issues a full or partial refund via the Bachs Refunds API.
 */
export async function issueBachsRefund(chargeIdOrReference: string): Promise<boolean> {
  if (!BACHS_API_KEY) {
    console.error("BACHS_API_KEY is not configured for refund.");
    return false;
  }

  try {
    const response = await fetch(`${BACHS_BASE_URL}/v1/refunds`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BACHS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        charge_id: chargeIdOrReference,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      console.log(`Bachs refund succeeded for ${chargeIdOrReference}:`, data);
      return true;
    } else {
      console.error(`Bachs refund failed for ${chargeIdOrReference}:`, data);
      return false;
    }
  } catch (error) {
    console.error("Error communicating with Bachs Refund API:", error);
    return false;
  }
}

/**
 * Cryptographically verifies an incoming Bachs webhook signature.
 * 
 * Rules:
 * 1. Checks timestamp tolerance to defeat replay attacks (within 300s).
 * 2. Computes HMAC-SHA256 of `${timestamp}.${rawBody}`.
 * 3. Strips formatting prefixes like `v1=` or `sha256=` if present.
 * 4. Performs constant-time comparison to prevent timing side-channel attacks.
 */
export function verifyBachsSignature(
  rawBody: string,
  signature: string | null,
  timestamp: string | null
): boolean {
  if (!BACHS_WEBHOOK_SECRET || !signature) {
    return false;
  }

  // 1. Replay attack verification
  if (timestamp) {
    const reqTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (isNaN(reqTime) || Math.abs(currentTime - reqTime) > WEBHOOK_TOLERANCE_SECONDS) {
      console.warn("Bachs webhook timestamp out of tolerance window:", { reqTime, currentTime });
      return false;
    }
  }

  // 2. Prepare payload to sign
  const signedPayload = timestamp ? `${timestamp}.${rawBody}` : rawBody;

  // 3. Compute expected HMAC-SHA256
  const expectedSignature = crypto
    .createHmac("sha256", BACHS_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  // Clean signature (handle potential "v1=" or "sha256=" prefix)
  let cleanSignature = signature.trim();
  if (cleanSignature.includes("=")) {
    cleanSignature = cleanSignature.split("=").pop() || "";
  }

  // 4. Constant-time comparison
  try {
    const expectedBuf = Buffer.from(expectedSignature, "hex");
    const actualBuf = Buffer.from(cleanSignature, "hex");
    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

