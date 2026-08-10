"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";

export default function CTASection() {
  return (
    <section id="booking" className="py-20 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Electric Blue Dark Mode Container */}
        <div className="bg-gradient-to-b from-[#0a1936] via-[#051026] to-[#030918] border border-blue-900/40 rounded-[24px] md:rounded-[32px] p-8 sm:p-12 md:p-16 text-center w-full shadow-2xl relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent-blue/15 blur-[120px] rounded-full pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-blue/15 border border-accent-blue/30 rounded-full text-xs font-medium text-accent-blue mb-6 mx-auto relative z-10">
            <HugeIcon name="tag" size={16} className="text-accent-blue" />
            <span>Special Offer</span>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 w-full max-w-3xl mx-auto text-center relative z-10">
            YOUR FIRST LESSON IS <br className="hidden sm:block" />
            <span className="italic text-accent-blue">COMPLETELY FREE!</span>
          </h2>

          {/* Subheading */}
          <p className="font-body text-base sm:text-lg text-slate-300 leading-relaxed mb-10 w-full max-w-xl mx-auto font-normal text-center relative z-10">
            No commitment. No payment info upfront. Just show up, have a conversation, and see if this is the right fit for you.
          </p>

          {/* CTA Button */}
          <div className="w-full flex justify-center mb-12 relative z-10">
            <Link
              href="/signup?redirect=/dashboard/book"
              id="cta-whatsapp-btn"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-text-primary rounded-full font-body text-base font-medium hover:bg-slate-100 hover:text-accent-blue transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <HugeIcon name="comment" size={20} className="text-accent-blue" />
              <span>Book now</span>
              <HugeIcon name="arrow-right" size={18} />
            </Link>
          </div>

          {/* Policy Note */}
          <div className="w-full max-w-2xl mx-auto p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl text-center relative z-10">
            <p className="w-full font-body text-xs text-slate-400 leading-relaxed font-normal text-center">
              Free trial limited to one redemption per student. Paid sessions can be rescheduled free of charge if requested more than 24 hours in advance. No-shows are non-refundable.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
