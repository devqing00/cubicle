import { NextResponse } from "next/server";
// import { adminDb as db } from "@/lib/firebase-admin";
import crypto from "crypto";

export async function GET(req: Request) {
  // Meta Cloud API Webhook Verification
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-hub-signature-256");

    if (!signature) {
      return new NextResponse("Missing signature", { status: 400 });
    }

    const expectedSignature = "sha256=" + crypto
      .createHmac("sha256", process.env.META_APP_SECRET || "")
      .update(bodyText)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const body = JSON.parse(bodyText);
    
    // Simplistic extraction of an inbound text message for demonstration
    // A real implementation requires parsing the specific Meta Cloud API payload structure
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const msg = messages[0];
      const from = msg.from; // Phone number
      const text = msg.text?.body;

      if (text) {
        // Look for the CUB-XXXXX reference in the message text
        const refMatch = text.match(/CUB-[A-Z0-9]{6}/);
        
        if (refMatch) {
          const bookingRef = refMatch[0];
          
          // 1. Query Firestore for this bookingRef
          // const snapshot = await db.collection("bookings").where("reference", "==", bookingRef).get();
          // if (!snapshot.empty) {
          //   const doc = snapshot.docs[0];
          //   2. Update status to 'wa_verified'
          //   await doc.ref.update({ status: "wa_verified" });
          
          //   3. Trigger automated WhatsApp reply with Paystack link
          //   await sendWhatsAppMessage(from, "Thanks! Click here to pay: https://paystack.com/pay/...");
          // }
          
          console.log(`Verified booking ${bookingRef} from ${from}`);
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Meta webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
