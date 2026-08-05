# CUBICLE
**Online Tutoring Booking Platform**
*Project Brief & Feature Specification - Draft for Client Review*

## 1. Overview
Cubicle is a single-instructor online tutoring website. Students can learn about the instructor, message them directly on WhatsApp, book a paid lesson or a free trial session, and receive an auto-generated video call link once their booking is confirmed and paid for. The platform is built around one core principle: booking and payment are automated, but a real conversation with the instructor on WhatsApp is a required, backend-enforced step before a lesson is confirmed.

## 2. Site Structure
The public-facing site is a single-page or lightly multi-page site with the following sections:
- **Landing / hero section** - introduces the instructor and the brand
- **Social links** - Instagram, LinkedIn, Facebook, TikTok
- **WhatsApp contact** - direct link to the instructor's WhatsApp Business number for questions
- **"What makes Cubicle stand out"** - differentiator section
- **Pricing & lesson types** - tiers the student selects from during booking
- **Free trial session** - same booking flow, priced at £0, limited to one redemption per student to prevent repeat abuse
- **Cancellation & refund policy** - short, visible policy page (see Section 7)
- **Booking form** - collects first name, age, WhatsApp phone number, and learning goals; a guardian name and contact number are also collected if the student is under 18 (see Section 6)

## 3. End-to-End Booking Flow
This is the full sequence from a student landing on the site to a confirmed, paid lesson with a video link in hand.
1. Student fills in biodata: first name, age, WhatsApp phone number, learning goal, and - if under 18 - a guardian name and contact number.
2. Student selects a pricing tier and lesson type, or the free trial option. The free trial is checked against phone number and email at booking creation, so it can only be redeemed once per student.
3. Student picks a class time on the embedded calendar, matched against the instructor's real availability.
4. Booking is created in a "pending WhatsApp verification" state, and the backend generates a unique booking reference.
5. Student is sent to WhatsApp with that reference pre-filled into the message text. The booking only moves forward once the backend receives an inbound message containing that reference - this is what makes the step actually compulsory, not just instructed (see Section 5.2).
6. Once verified, the booking moves to "requires confirmation" in Cal.com - the slot is held, but no calendar event or video link is generated yet.
7. Student is taken to payment (Paystack).
8. If payment succeeds - the booking is confirmed, a Google Calendar event is created automatically, and a Google Meet link is auto-generated for the lesson.
9. If payment is not completed within a set window - the booking is never confirmed. It is saved as a draft against the client's record, and the held slot is released back for other students to book. The instructor can see these drafts and follow up manually (see Section 8).
10. Student receives an automated WhatsApp confirmation containing the date, time, and Meet link.
11. Student receives an automated WhatsApp reminder roughly one hour before the lesson starts.

> **Design decision confirmed**
> Booking happens before payment. Payment confirms the booking. If payment isn't completed, the booking stays as an unconfirmed draft and does not occupy the slot indefinitely.

## 4. Calendar & Video Link Automation
### 4.1 Why Cal.com
Rather than building a custom availability engine, slot-locking logic, and calendar sync from scratch, the platform uses Cal.com to handle scheduling. Cal.com already solves the hard parts: recurring availability rules, timezone handling, and preventing two students from booking the same slot at once.

### 4.2 Google Meet auto-generation
The instructor connects their Google Calendar to Cal.com once (a one-time OAuth setup). The lesson event type is set to use Google Meet as its location. When a booking is confirmed, Cal.com creates the calendar event via the Google Calendar API and Google auto-generates the Meet link as part of that event - no manual link creation, and no need for the platform to talk to Google's APIs directly.

### 4.3 Pay-to-confirm mechanic
Cal.com's native "requires confirmation" setting is used to hold a slot without finalizing it. Because the instructor is based in Nigeria and needs Paystack (not Stripe/PayPal) for payment, the payment gate is orchestrated by the platform's own backend rather than by Cal.com directly:
- Student selects a slot -> Cal.com sends a "booking requested" webhook -> backend stores it as pending payment.
- Backend generates a Paystack payment reference and redirects the student to pay.
- On successful payment, Paystack's webhook triggers the backend to confirm the booking via Cal.com's API - this is what creates the calendar event and Meet link.
- A scheduled cleanup job checks for pending, unpaid bookings older than the set window (suggested: 20-30 minutes) and releases those slots automatically.

### 4.4 Webhook idempotency
Both Cal.com and Paystack can retry webhook deliveries on their end. Every incoming webhook is checked against a stored table of already-processed event IDs (Cal.com booking UID, Paystack transaction reference) before any action is taken. This prevents a retried delivery from double-confirming a booking or sending the WhatsApp confirmation twice - built in from the start rather than patched in after an incident.

### 4.5 Cal.com free plan
Confirmed as of 2026: Cal.com's free plan supports one user, unlimited event types, unlimited calendar connections, and unlimited bookings, with double-booking prevention included. The only limitation on free is Cal.com's own branding on the booking page, which is removable on a paid plan later if the instructor wants a fully white-labeled experience. For a single-instructor v1, the free plan comfortably covers this project.

## 5. WhatsApp Integration
### 5.1 Two distinct WhatsApp touchpoints
The platform uses WhatsApp for two different purposes, and they are kept deliberately separate:
1. **Compulsory human conversation** - the student must message the instructor directly before a booking can proceed. This is a real conversation, not automated, and is where trust-building and question-asking happens.
2. **Automated notifications** - booking confirmation and a pre-lesson reminder, sent automatically by the system once payment succeeds.

### 5.2 Enforcing the compulsory step
A unique booking reference is generated as soon as a slot is selected and pre-filled into the wa.me link's message text, so the student doesn't have to type anything extra. The booking record stays in a "pending WhatsApp verification" state until Meta's webhook delivers an inbound message containing that reference, at which point the backend unlocks the next step. This closes the gap where a student could tap the WhatsApp button, send nothing, and continue to payment anyway.

### 5.3 Provider decision: Meta Cloud API
Meta's WhatsApp Cloud API is used directly rather than routing through Twilio. Twilio sits on top of the same Cloud API infrastructure and adds a flat per-message markup on top of Meta's own rate, so it offers no cost advantage here. Since the backend is already handling webhooks for Cal.com and Paystack, adding a Meta webhook receiver is a natural extension rather than new complexity, and Twilio's main advantage - a ready-made console and multi-channel tooling - isn't needed for a single WhatsApp use case.
A useful side effect of requiring the student to message the instructor first: that inbound message opens a 24-hour free messaging window with Meta, during which utility-category messages (like the automated confirmation and reminder) are typically sent at no cost, as long as they fall within that window.

### 5.4 Message templates
Both automated messages are utility-category templates and need to be pre-approved by Meta before going live - approval can take a day or two, so templates should be submitted early in the build.
- **Confirmation** (sent immediately on payment success): lesson date, time, and Meet link.
- **Reminder** (sent ~ 1 hour before lesson start, via a scheduled job): a short nudge with the Meet link.

## 6. Minors & Guardian Safeguarding
Tutoring platforms commonly serve students under 18, and the current flow requires every student to personally initiate direct WhatsApp contact with the adult instructor. If any target students are minors, that unmediated first contact needs a safeguard rather than being left as-is.

Default approach built into this spec: if a student's stated age is under 18, the booking form requires a guardian's name and contact number, and the compulsory WhatsApp step is framed as guardian-to-instructor contact rather than requiring the minor to message the instructor alone. This is a starting assumption, not a confirmed decision - it should be reviewed with the client alongside the actual target age range before this part of the build is locked in.

> **Needs client confirmation**
> What age range is Cubicle actually targeting? If minors are in scope, confirm the guardian-contact approach above, or specify an alternative before this is built.

## 7. Cancellation, Rescheduling & Refund Policy
A stated policy needs to exist and be visible on the site before launch, both to set student expectations and to give the instructor a defensible position on Paystack disputes. Suggested starting policy, for the client to adjust:
- Reschedule free of charge if requested more than 24 hours before the lesson start time.
- Reschedule requests inside the 24-hour window are handled at the instructor's discretion.
- No-shows without prior notice are non-refundable.
- Cancellations more than 24 hours out are eligible for a full refund; cancellations inside 24 hours are non-refundable.

## 8. Instructor Dashboard
Everything so far is student-facing. The instructor needs a simple internal view to run the day-to-day side of the business:
- List of confirmed upcoming lessons with student details and Meet links.
- List of pending drafts - students who started booking but didn't complete payment - so the instructor can send a manual "still want your slot?" nudge before the hold expires.
- Basic history of past lessons per student, useful for repeat bookings and follow-up.

## 9. Technical Stack Summary

| Layer | Choice |
|---|---|
| Frontend | Next.js, Tailwind CSS |
| Backend | FastAPI |
| Database | Firebase (Firestore) |
| Auth | Firebase Auth |
| Scheduling | Cal.com (free plan) - availability, slot locking, Google Calendar sync |
| Video calls | Google Meet - auto-generated via Cal.com's Google Calendar integration |
| Payments | Paystack |
| Messaging | Meta WhatsApp Cloud API - direct integration, no BSP markup |
| Scheduled jobs | Booking-expiry cleanup, pre-lesson reminder dispatch |
| Reliability | Webhook idempotency checks on all Cal.com / Paystack / Meta events |

## 10. Open Questions for the Client
- What age range is Cubicle targeting - confirms whether the guardian-contact safeguard in Section 6 is needed and correctly designed.
- Exact wording/tone for the WhatsApp confirmation and reminder templates - to be drafted and submitted for Meta approval.
- Preferred unpaid-booking expiry window (starting suggestion: 20-30 minutes) before a held slot is released.
- Whether the suggested cancellation/refund policy in Section 7 matches how the instructor actually wants to run this.
- Whether Cal.com branding on the booking page is acceptable for launch, or whether white-labeling should be budgeted in from the start.
- Prepared as a working brief - subject to revision as scope is finalized with the client.

## 11. Edge Cases & Technical Considerations

### 11.1 The WhatsApp Context Switch (UX Drop-off Risk)
**The Risk:** When the student is redirected to the WhatsApp app, they leave the website. Once they hit "send" in WhatsApp, how do they get back to the payment page?

**Solution:** When the backend receives the Meta webhook with the correct reference, it should immediately send an automated WhatsApp reply containing the Paystack payment link (e.g., "Thanks for reaching out! Click here to complete your payment and confirm your slot: [Link]"). This prevents the student from having to navigate back to the browser manually.

### 11.2 WhatsApp Reference Tampering
**The Risk:** You are relying on the student sending a pre-filled message containing a unique booking reference. What if they accidentally (or intentionally) delete the reference from the text box before hitting send?

**Solution:** If a message arrives from an unknown number without a reference, the system could automatically reply: "Hi! Are you trying to book a lesson? Please reply with your booking reference number so we can confirm your slot." Alternatively, you could allow the instructor to manually link a chat to a pending booking in their dashboard.

### 11.3 Race Conditions (Payment vs. Cleanup Job)
**The Risk:** You have a scheduled cleanup job that releases unpaid slots after 20-30 minutes. If a student sits on the Paystack checkout page and finally pays at minute 29, the Paystack success webhook and the cleanup job might fire at the exact same time.

**Solution:** Ensure atomic updates in the database. When the payment webhook arrives, it should check if the booking is still pending before marking it paid. If the cleanup job just released the slot, the system needs to gracefully handle the refund or prompt the instructor to manually reschedule, rather than silently eating the money for a released slot.

### 11.4 Database Choice (Firebase Firestore constraints)
**The Risk:** The system is using Firebase (Firestore) for database and authentication. Firestore is a NoSQL document database, whereas this system is highly relational and state-driven (Users <-> Bookings <-> Payments).

**Solution:** You will need to carefully design your data model, likely using subcollections or denormalization, to handle relational queries. Additionally, use Firestore's atomic transactions or batch writes for webhook updates to prevent race conditions during booking state transitions (Pending WA -> Pending Payment -> Paid).
