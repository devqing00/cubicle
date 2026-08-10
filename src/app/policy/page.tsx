import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-surface-base pt-32 pb-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-border-warm shadow-sm">
        
        <Link href="/" className="inline-flex items-center gap-2 text-mid-gray-brown hover:text-dark-charcoal font-body text-sm font-medium transition-colors mb-8">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="font-heading text-4xl font-bold text-dark-charcoal mb-4">Cancellation & Refund Policy</h1>
        <p className="font-body text-mid-gray-brown mb-12">Last updated: August 2026</p>

        <div className="space-y-8 font-body text-dark-charcoal leading-relaxed">
          
          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">1. Rescheduling</h2>
            <ul className="list-disc pl-5 space-y-2 text-mid-gray-brown">
              <li>You may reschedule your lesson free of charge if requested <strong>more than 24 hours</strong> before the lesson start time.</li>
              <li>Reschedule requests made <strong>inside the 24-hour window</strong> are handled entirely at the instructor&apos;s discretion and are not guaranteed.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">2. Cancellations & Refunds</h2>
            <ul className="list-disc pl-5 space-y-2 text-mid-gray-brown">
              <li>Cancellations made <strong>more than 24 hours</strong> before the lesson start time are eligible for a full refund.</li>
              <li>Cancellations made <strong>inside the 24-hour window</strong> are non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">3. No-Shows</h2>
            <p className="text-mid-gray-brown">
              If you fail to attend a scheduled lesson without prior notice (a &quot;no-show&quot;), the lesson is considered forfeited and is <strong>strictly non-refundable</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">4. Payment & Booking Confirmation</h2>
            <p className="text-mid-gray-brown">
              Booking a slot holds it temporarily. Your booking is only officially confirmed once payment is successful. If payment is not completed within the specified window (typically 30 minutes), the slot will be released back to the public calendar.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
