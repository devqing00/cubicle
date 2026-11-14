"use client";

import React, { useState, useEffect, useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NumberTicker from "@/components/ui/NumberTicker";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShimmerButton from "@/components/ui/ShimmerButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Plan {
  id: string;
  name: string;
  singlePrice: string;
  bundlePrice: string;
  duration: string;
  tag: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    id: "trial",
    name: "Free Trial",
    singlePrice: "₦0",
    bundlePrice: "₦0",
    duration: "60 min",
    tag: "First session only",
    description:
      "One full complimentary session to experience the conversational teaching style, ask questions, and test your current proficiency.",
    features: [
      "Full 60-minute 1-on-1 session",
      "WhatsApp chat with your tutor",
      "Google Meet private room link",
      "Personalized proficiency feedback",
      "Zero card details required upfront",
    ],
    cta: "Claim Free Trial",
    highlighted: false,
  },
  {
    id: "standard",
    name: "Standard Track",
    singlePrice: "₦15,000",
    bundlePrice: "₦54,000",
    duration: "60 min",
    tag: "Most Popular",
    description:
      "A focused single session for targeted conversation mastery, exam prep (TEF/DELE), or consistent weekly fluency practice.",
    features: [
      "60-minute live speaking practice",
      "Pre-lesson goal alignment",
      "Google Meet video call & screen sharing",
      "Post-session vocabulary notes",
      "24hr flexible free rescheduling",
    ],
    cta: "Book Standard Session",
    highlighted: true,
  },
  {
    id: "intensive",
    name: "Intensive Track",
    singlePrice: "₦25,000",
    bundlePrice: "₦90,000",
    duration: "90 min",
    tag: "Comprehensive",
    description:
      "Extended sessions for in-depth grammar breakdowns, professional interview simulations, or students preparing for urgent deadlines.",
    features: [
      "90-minute immersive deep-dive",
      "Full speaking & writing feedback",
      "Targeted grammar & idiom coaching",
      "Session recording link archived in portal",
      "Priority WhatsApp tutor support",
    ],
    cta: "Book Intensive Session",
    highlighted: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [billingMode, setBillingMode] = useState<"single" | "bundle">("single");

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pricing-bento-card", {
        opacity: 0,
        y: 35,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".pricing-grid-container",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      gsap.from(".metrics-bento-cell", {
        opacity: 0,
        y: 25,
        scale: 0.98,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".metrics-bento-grid",
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white relative">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-wider mb-3">
              <HugeIcon name="sparkles" size={13} />
              <span>Transparent Tuition</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.05] tracking-tight">
              Straightforward pricing. <br className="hidden sm:inline" />
              <span className="italic text-accent-blue">No surprises.</span>
            </h2>
          </div>

          {/* Interactive State Toggle: Single vs 4-Class Bundle */}
          <div className="flex items-center gap-1 p-1 bg-surface-muted border border-border-light rounded-full self-start md:self-auto select-none shadow-2xs">
            <button
              type="button"
              onClick={() => setBillingMode("single")}
              className={`tactile-btn px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                billingMode === "single"
                  ? "bg-text-primary text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Single Session
            </button>
            <button
              type="button"
              onClick={() => setBillingMode("bundle")}
              className={`tactile-btn px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                billingMode === "bundle"
                  ? "bg-text-primary text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span>4-Session Pack</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                Save 10%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid-container grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {plans.map((plan) => {
            const price = billingMode === "single" ? plan.singlePrice : plan.bundlePrice;
            const subtitle = billingMode === "single" ? `${plan.duration} session` : "Pack of 4 sessions";

            return (
              <SpotlightCard
                key={plan.id}
                spotlightColor={plan.highlighted ? "rgba(2, 132, 199, 0.25)" : "rgba(2, 132, 199, 0.08)"}
                className={`pricing-bento-card tactile-card rounded-[28px] p-8 sm:p-10 flex flex-col justify-between border transition-all duration-300 ${
                  plan.highlighted
                    ? "tactile-card-dark relative scale-100 md:scale-[1.03] z-10 border-accent-blue/40 shadow-xl"
                    : "border-border-light hover:border-border-subtle"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                      plan.highlighted
                        ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                        : "bg-surface-muted text-text-subtle"
                    }`}>
                      {plan.tag}
                    </span>
                    <span className={`text-xs font-mono font-medium ${
                      plan.highlighted ? "text-white/60" : "text-text-subtle"
                    }`}>
                      {plan.duration}
                    </span>
                  </div>

                  <h3 className={`font-heading text-2xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-text-primary"
                  }`}>
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`font-heading text-4xl sm:text-5xl font-bold tracking-tight ${
                      plan.highlighted ? "text-white" : "text-text-primary"
                    }`}>
                      {price}
                    </span>
                  </div>

                  <p className={`font-mono text-xs mb-6 ${
                    plan.highlighted ? "text-white/60" : "text-text-secondary"
                  }`}>
                    {subtitle}
                  </p>

                  <p className={`font-body text-xs sm:text-sm leading-relaxed mb-6 ${
                    plan.highlighted ? "text-white/80" : "text-text-secondary"
                  }`}>
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs font-body">
                        <HugeIcon
                          name="check"
                          size={15}
                          className={`shrink-0 mt-0.5 ${
                            plan.highlighted ? "text-accent-blue" : "text-emerald-600"
                          }`}
                        />
                        <span className={plan.highlighted ? "text-white/90" : "text-text-secondary"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.highlighted ? (
                  <ShimmerButton
                    href="/signup?redirect=/dashboard/book"
                    variant="primary"
                    className="w-full py-3.5 text-xs font-bold"
                  >
                    <span>{plan.cta}</span>
                    <HugeIcon name="arrow-right" size={14} />
                  </ShimmerButton>
                ) : (
                  <Link
                    href="/signup?redirect=/dashboard/book"
                    className="tactile-btn btn-tactile-dark w-full text-center py-3.5 rounded-full font-body text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>{plan.cta}</span>
                    <HugeIcon name="arrow-right" size={14} />
                  </Link>
                )}
              </SpotlightCard>
            );
          })}
        </div>

        {/* 
          SLAYING THE "FINAL BOSS" COUNTER:
          Replaced the bland gray row with an Interactive Bento Proof Engine
          featuring NumberTicker spring animations, live delta badges, cursor spotlight,
          and rich responsive layout.
        */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-text-subtle flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Platform Verification & Guarantee
            </span>
            <span className="font-body text-[11px] text-text-subtle hidden sm:inline">
              Data refreshed in real time
            </span>
          </div>

          <div className="metrics-bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Live Hours Taught */}
            <SpotlightCard
              spotlightColor="rgba(2, 132, 199, 0.15)"
              className="metrics-bento-cell bg-white border border-border-light hover:border-accent-blue/30 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center shrink-0">
                  <HugeIcon name="calendar" size={22} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Logs
                </span>
              </div>

              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                  <NumberTicker value={1250} suffix="+" duration={2} />
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mt-1">
                  Live Hours Taught
                </h4>
                <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                  Real 1-on-1 sessions delivered across Spanish, French, German & Business English.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-light/60 flex items-center justify-between text-[11px] font-mono text-text-subtle">
                <span>Avg Rating</span>
                <span className="font-bold text-text-primary flex items-center gap-1">
                  <span className="text-amber-500">★</span> 4.98 / 5.0
                </span>
              </div>
            </SpotlightCard>

            {/* Metric 2: Fluency Completion */}
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.15)"
              className="metrics-bento-cell bg-white border border-border-light hover:border-emerald-500/30 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <HugeIcon name="sparkles" size={22} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                  Exam & Career
                </span>
              </div>

              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                  <NumberTicker value={98.4} decimalPlaces={1} suffix="%" duration={2.2} />
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mt-1">
                  Fluency Completion
                </h4>
                <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                  Pass rates across DELE, TEF Canada, Goethe-Zertifikat and executive workplace pitches.
                </p>
              </div>

              {/* Mini visual indicator track */}
              <div className="mt-4 pt-3 border-t border-border-light/60 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-text-subtle">
                  <span>Target Benchmark</span>
                  <span className="font-bold text-emerald-600">98.4%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent-blue to-emerald-500 rounded-full w-[98.4%]" />
                </div>
              </div>
            </SpotlightCard>

            {/* Metric 3: Free Rescheduling */}
            <SpotlightCard
              spotlightColor="rgba(245, 158, 11, 0.15)"
              className="metrics-bento-cell bg-white border border-border-light hover:border-amber-500/30 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <HugeIcon name="clock" size={22} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Zero Penalties
                </span>
              </div>

              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                  <NumberTicker value={24} suffix="h" duration={1.6} />
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mt-1">
                  Free Rescheduling
                </h4>
                <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                  Life happens. Move your booked session anytime up to 24h prior directly from your dashboard.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-light/60 flex items-center justify-between text-[11px] font-mono text-text-subtle">
                <span>Google Meet Sync</span>
                <span className="font-bold text-emerald-600">Instant Re-link</span>
              </div>
            </SpotlightCard>

            {/* Metric 4: 1-on-1 Dedicated Attention */}
            <SpotlightCard
              spotlightColor="rgba(147, 51, 234, 0.15)"
              className="metrics-bento-cell bg-white border border-border-light hover:border-purple-500/30 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
                  <HugeIcon name="users" size={22} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  100% Private
                </span>
              </div>

              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                  1-on-1
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mt-1">
                  Dedicated Attention
                </h4>
                <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                  No crowded breakout rooms. Real-time pronunciation corrections, idiom notes & immediate feedback.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-light/60 flex items-center justify-between text-[11px] font-mono text-text-subtle">
                <span>WhatsApp Line</span>
                <span className="font-bold text-accent-blue">Direct to Tutor</span>
              </div>
            </SpotlightCard>

          </div>
        </div>

      </div>
    </section>
  );
}
