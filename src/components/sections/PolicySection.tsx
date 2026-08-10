"use client";

import React from "react";
import HugeIcon from "@/components/ui/HugeIcon";

export default function PolicySection() {
  return (
    <section id="cancellation-policy" className="py-20 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[900px] mx-auto w-full">
        <div className="text-center mb-12 w-full max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-muted border border-border-light rounded-full text-xs font-medium text-text-secondary mb-4 hover:border-accent-blue/30 transition-colors mx-auto">
            <HugeIcon name="legal" size={16} className="text-accent-blue" />
            <span>Clear Policies</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary leading-tight tracking-tight mb-3 w-full text-center">
            Cancellation & Refund Policy
          </h2>
          <p className="font-body text-base text-text-secondary leading-relaxed w-full max-w-md mx-auto font-normal text-center">
            We keep things simple and fair. Here is what happens if your schedule changes.
          </p>
        </div>

        <div className="bg-white border border-border-light rounded-[24px] p-6 sm:p-10 shadow-sm space-y-8 hover:border-border-subtle transition-colors w-full">
          
          <div className="flex items-start gap-4 w-full">
            <HugeIcon name="check" size={24} className="text-accent-blue shrink-0 mt-0.5" />
            <div className="w-full">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-1">More than 24 hours notice</h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed font-normal w-full">
                You can reschedule your lesson completely free of charge, or cancel it for a full refund.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border-light" />

          <div className="flex items-start gap-4 w-full">
            <HugeIcon name="alert" size={24} className="text-text-primary shrink-0 mt-0.5" />
            <div className="w-full">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Less than 24 hours notice</h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed font-normal w-full">
                Cancellations inside the 24-hour window are non-refundable. If you need to reschedule inside this window, please reach out via WhatsApp—these requests are handled at the instructor&apos;s discretion based on availability.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border-light" />

          <div className="flex items-start gap-4 w-full">
            <HugeIcon name="cancel" size={24} className="text-text-subtle shrink-0 mt-0.5" />
            <div className="w-full">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-1">No-shows</h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed font-normal w-full">
                If you do not attend your scheduled lesson and provide no prior notice, the lesson is non-refundable.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
