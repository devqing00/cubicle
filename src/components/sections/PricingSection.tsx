"use client";

import React, { useState } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import NumberTicker from "@/components/ui/NumberTicker";

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
  const [billingMode, setBillingMode] = useState<"single" | "bundle">("single");

  return (
    <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white relative">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.05] tracking-tight">
              Straightforward pricing. <br className="hidden sm:inline" />
              <span className="italic text-accent-blue">No surprises.</span>
            </h2>
          </div>

          {/* State Toggle: Single vs 4-Class Bundle */}
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
              <div
                key={plan.id}
                className={`tactile-card rounded-[28px] p-8 sm:p-10 flex flex-col justify-between border transition-all duration-300 ${
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

        {/* 
          UPGRADED CLEAN METRICS SHOWCASE:
          100% visible, fully rendered, high-taste Swiss layout with no AI slop badges.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Metric 1 */}
          <div className="bg-white border border-border-light rounded-[24px] p-7 flex flex-col justify-between shadow-2xs hover:border-border-subtle transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center text-text-primary mb-5">
              <HugeIcon name="calendar" size={20} />
            </div>
            <div>
              <div className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                <NumberTicker value={1250} suffix="+" />
              </div>
              <h4 className="font-heading font-bold text-sm text-text-primary mt-1.5">
                Live Hours Taught
              </h4>
              <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                1-on-1 speaking sessions across all active language curriculum tracks.
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-border-light rounded-[24px] p-7 flex flex-col justify-between shadow-2xs hover:border-border-subtle transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center text-text-primary mb-5">
              <HugeIcon name="sparkles" size={20} />
            </div>
            <div>
              <div className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                <NumberTicker value={98.4} decimalPlaces={1} suffix="%" />
              </div>
              <h4 className="font-heading font-bold text-sm text-text-primary mt-1.5">
                Fluency Completion
              </h4>
              <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                Student target attainment across DELE, TEF Canada, and executive benchmarks.
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-border-light rounded-[24px] p-7 flex flex-col justify-between shadow-2xs hover:border-border-subtle transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center text-text-primary mb-5">
              <HugeIcon name="clock" size={20} />
            </div>
            <div>
              <div className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                <NumberTicker value={24} suffix="h" />
              </div>
              <h4 className="font-heading font-bold text-sm text-text-primary mt-1.5">
                Free Rescheduling
              </h4>
              <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                Shift or reschedule your slot directly in the dashboard up to 24 hours prior.
              </p>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white border border-border-light rounded-[24px] p-7 flex flex-col justify-between shadow-2xs hover:border-border-subtle transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center text-text-primary mb-5">
              <HugeIcon name="users" size={20} />
            </div>
            <div>
              <div className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                1-on-1
              </div>
              <h4 className="font-heading font-bold text-sm text-text-primary mt-1.5">
                Dedicated Attention
              </h4>
              <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                Every minute is focused on your active speaking, immediate pronunciation, and notes.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
