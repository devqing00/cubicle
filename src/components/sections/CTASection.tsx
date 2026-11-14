"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";

export default function CTASection() {
  return (
    <section id="booking" className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Container with High-Tension Tactile Depth */}
        <div className="tactile-section-container-dark bg-gradient-to-b from-[#0e1726] via-[#09101d] to-[#040810] border border-white/12 rounded-[28px] md:rounded-[36px] p-8 sm:p-14 md:p-16 text-center w-full relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

          {/* Headline */}
          <h2 className="font-heading text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.03] tracking-tight mb-6 w-full max-w-4xl mx-auto text-center relative z-10">
            SPEAK FLUENTLY. <br />
            START WITH A <span className="italic text-accent-blue">FREE LESSON.</span>
          </h2>

          {/* Subheading */}
          <p className="font-body text-base sm:text-lg text-slate-300 leading-relaxed mb-10 w-full max-w-xl mx-auto font-normal text-center relative z-10">
            Zero commitment. No credit card required. Pick your available slot, introduce yourself on WhatsApp, and meet your tutor.
          </p>

          {/* CTA Buttons */}
          <div className="w-full flex flex-wrap items-center justify-center gap-4 mb-12 relative z-10">
            <Link
              href="/signup?redirect=/dashboard/book"
              className="tactile-btn btn-tactile-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-body text-sm sm:text-base font-semibold shadow-lg"
            >
              <span>Claim Free 60-Min Session</span>
              <HugeIcon name="arrow-right" size={18} />
            </Link>
            <Link
              href="/how-it-works"
              className="tactile-btn btn-tactile-secondary inline-flex items-center gap-2 px-7 py-4 rounded-full font-body text-sm sm:text-base font-semibold"
            >
              <span>See How It Works</span>
            </Link>
          </div>

          {/* Guarantee & Terms Bar */}
          <div className="w-full max-w-2xl mx-auto p-4 bg-white/5 border border-white/10 rounded-2xl text-center relative z-10">
            <p className="font-mono text-xs text-slate-400 leading-relaxed font-normal">
              Free trial redemption: 1 session per student • Full 60 minutes • Includes live pronunciation feedback
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
