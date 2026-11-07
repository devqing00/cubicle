"use client";

import React, { useEffect, useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PolicySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".policy-bento-card", {
        opacity: 0,
        y: 35,
        duration: 0.75,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
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
    <section id="cancellation-policy" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.05] tracking-tight">
              Honest policies. <br className="hidden sm:inline" />
              <span className="italic text-accent-blue">Built on trust.</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-text-secondary max-w-md leading-relaxed font-normal">
            We value your time and our tutors&apos; schedules. Here are our exact rules for rescheduling, refunds, and cancellations.
          </p>
        </div>

        {/* 3-Pillar Standards Card */}
        <div className="policy-bento-card tactile-card rounded-[28px] p-6 sm:p-12 space-y-8 w-full mb-10">
          
          <div className="flex flex-col sm:flex-row items-start gap-5 w-full">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <HugeIcon name="check" size={20} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  More than 24 hours notice
                </h3>
                <span className="font-mono text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  100% Free Rescheduling or Refund
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                Life happens. If you notify us or adjust your session via your dashboard at least 24 hours prior to class, your slot is released with zero penalty. Reschedule immediately or receive a full credit refund.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-5 w-full">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <HugeIcon name="alert" size={20} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Inside the 24-hour window
                </h3>
                <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Tutor Discretion
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                Because your instructor has already blocked off that time slot and prepared materials, cancellations under 24 hours are non-refundable. For emergencies, contact your instructor directly on WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-5 w-full">
            <div className="w-10 h-10 rounded-xl bg-surface-muted text-text-subtle border border-border-light flex items-center justify-center shrink-0">
              <HugeIcon name="cancel" size={20} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Unnotified no-shows
                </h3>
                <span className="font-mono text-[11px] font-bold text-text-subtle bg-surface-muted px-2.5 py-0.5 rounded-full border border-border-light">
                  Non-refundable
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                Instructors wait in the Google Meet room for 15 minutes. If a student does not join and provides no notification, the session is marked as completed and forfeited.
              </p>
            </div>
          </div>

        </div>

        {/* Read Full Policy Link */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-subtle font-mono">
            Governed by Cubicle Student Terms of Service
          </span>
          <Link
            href="/cancellation-policy"
            className="swiss-link text-xs font-semibold hover:text-accent-blue"
          >
            <span>Read Complete Legal Policy</span>
            <HugeIcon name="arrow-up-right" size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
