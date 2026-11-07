"use client";

import React, { useState, useEffect, useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
        y: 40,
        duration: 0.75,
        stagger: 0.1,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: ".pricing-grid-container",
          start: "top 82%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.05] tracking-tight">
              Straightforward pricing. <br className="hidden sm:inline" />
              <span className="italic text-accent-blue">No surprises.</span>
            </h2>
          </div>

          {/* Interactive State Toggle: Single vs 4-Class Bundle */}
          <div className="flex items-center gap-1 p-1 bg-surface-muted border border-border-light rounded-full self-start md:self-auto select-none">
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
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                Save 10%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid-container grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {plans.map((plan) => {
            const price = billingMode === "single" ? plan.singlePrice : plan.bundlePrice;
            const subtitle = billingMode === "single" ? `${plan.duration} session` : "Pack of 4 sessions";

            return (
              <div
                key={plan.id}
                className={`pricing-bento-card tactile-card rounded-[28px] p-8 sm:p-10 flex flex-col justify-between swiss-lift ${
                  plan.highlighted ? "tactile-card-dark relative scale-100 md:scale-[1.03] z-10" : ""
                }`}
                style={{
                  transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${
                      plan.highlighted ? "text-accent-blue" : "text-text-subtle"
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

                <Link
                  href="/signup?redirect=/dashboard/book"
                  className={`tactile-btn w-full text-center py-3.5 rounded-full font-body text-xs font-semibold flex items-center justify-center gap-2 ${
                    plan.highlighted ? "btn-tactile-primary" : "btn-tactile-dark"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <HugeIcon name="arrow-right" size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Swiss Metric Callout Grid (FUEL Frame 15 Style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-surface-muted/60 border border-border-light rounded-[24px]">
          <div>
            <h4 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              1,250+
            </h4>
            <p className="font-body text-xs text-text-secondary mt-1">
              Live Hours Taught
            </p>
          </div>
          <div>
            <h4 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              98.4%
            </h4>
            <p className="font-body text-xs text-text-secondary mt-1">
              Fluency Completion
            </p>
          </div>
          <div>
            <h4 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              24h
            </h4>
            <p className="font-body text-xs text-text-secondary mt-1">
              Free Rescheduling
            </p>
          </div>
          <div>
            <h4 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              1-on-1
            </h4>
            <p className="font-body text-xs text-text-secondary mt-1">
              100% Dedicated Attention
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
