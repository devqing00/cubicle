import React from "react";

export default function PolicySection() {
  return (
    <section id="cancellation-policy" className="py-24 bg-surface-base relative border-t border-border-warm">
      <div className="max-w-[800px] mx-auto px-6 relative z-10">
                <h2 className="font-heading text-[clamp(40px,5vw,56px)] font-bold text-dark-charcoal leading-[1.1] tracking-[-0.02em] mb-6 text-center">
          Cancellation & Refund Policy
        </h2>
        
        <p className="font-body text-lg text-mid-gray-brown mb-12 text-center max-w-[600px] mx-auto">
          We keep things simple and fair. Here&apos;s what happens if your schedule changes.
        </p>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-brutal border border-border-warm flex flex-col gap-6">
          
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-highlight-green mt-2.5 shrink-0" />
            <div>
              <h3 className="font-heading text-xl font-bold text-oboe-black mb-1">More than 24 hours notice</h3>
              <p className="font-body text-[15px] text-mid-gray-brown leading-relaxed">
                You can reschedule your lesson completely free of charge, or cancel it for a full refund.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border-warm/50" />

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-chip-yellow mt-2.5 shrink-0" />
            <div>
              <h3 className="font-heading text-xl font-bold text-oboe-black mb-1">Less than 24 hours notice</h3>
              <p className="font-body text-[15px] text-mid-gray-brown leading-relaxed">
                Cancellations inside the 24-hour window are non-refundable. If you need to reschedule inside this window, please reach out via WhatsApp—these requests are handled at the instructor&apos;s discretion based on availability.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border-warm/50" />

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-chip-pink mt-2.5 shrink-0" />
            <div>
              <h3 className="font-heading text-xl font-bold text-oboe-black mb-1">No-shows</h3>
              <p className="font-body text-[15px] text-mid-gray-brown leading-relaxed">
                If you do not attend your scheduled lesson and provide no prior notice, the lesson is non-refundable. 
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
