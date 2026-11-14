"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShimmerButton from "@/components/ui/ShimmerButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".cta-bento-container", {
        opacity: 0,
        scale: 0.96,
        y: 40,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="booking" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Container with High-Tension Tactile Depth */}
        <div className="cta-bento-container tactile-section-container-dark bg-gradient-to-b from-[#0e1726] via-[#09101d] to-[#040810] border border-white/12 rounded-[28px] md:rounded-[36px] p-8 sm:p-14 md:p-16 text-center w-full relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-sky-500/15 blur-[120px] rounded-full pointer-events-none z-0" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-blue text-xs font-bold uppercase tracking-wider mb-6 relative z-10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            <span>Zero Commitment Trial</span>
          </div>

          {/* Headline */}
          <h2 className="font-heading text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.03] tracking-tight mb-6 w-full max-w-4xl mx-auto text-center relative z-10">
            SPEAK FLUENTLY. <br />
            START WITH A <span className="italic text-accent-blue">FREE LESSON.</span>
          </h2>

          {/* Subheading */}
          <p className="font-body text-base sm:text-lg text-slate-300 leading-relaxed mb-10 w-full max-w-xl mx-auto font-normal text-center relative z-10">
            Zero card details required upfront. Pick your available slot, introduce yourself on WhatsApp, and meet your 1-on-1 language coach.
          </p>

          {/* CTA Buttons */}
          <div className="w-full flex flex-wrap items-center justify-center gap-4 mb-12 relative z-10">
            <ShimmerButton
              href="/signup?redirect=/dashboard/book"
              variant="primary"
              className="px-8 py-4 text-sm sm:text-base font-bold shadow-xl"
            >
              <span>Claim Free 60-Min Session</span>
              <HugeIcon name="arrow-right" size={18} />
            </ShimmerButton>
            <Link
              href="/how-it-works"
              className="tactile-btn btn-tactile-secondary inline-flex items-center gap-2 px-7 py-4 rounded-full font-body text-sm sm:text-base font-semibold"
            >
              <span>See How It Works</span>
            </Link>
          </div>

          {/* Guarantee & Terms Bar */}
          <div className="w-full max-w-2xl mx-auto p-4 bg-white/5 border border-white/10 rounded-2xl text-center relative z-10 backdrop-blur-xs flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold">
              <HugeIcon name="check" size={14} /> Full 60 minutes
            </span>
            <span className="text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 font-semibold">
              <HugeIcon name="sparkles" size={14} /> Real-time feedback
            </span>
            <span className="text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold">
              <HugeIcon name="shield" size={14} /> No card required
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
