"use client";

import React from "react";
import HugeIcon from "@/components/ui/HugeIcon";

const plans = [
  {
    id: "trial",
    name: "Free Trial",
    price: "₦0",
    duration: "60 min",
    tag: "First session only",
    description:
      "One complimentary session to experience the teaching style, ask questions, and decide if Cubicle is the right fit.",
    features: [
      "Full 60-minute lesson",
      "WhatsApp chat with instructor",
      "Google Meet video call",
      "Limited to one per student",
    ],
    cta: "Claim free trial",
    highlighted: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "₦15,000",
    duration: "60 min",
    tag: "Most popular",
    description:
      "A focused single session for targeted help on a topic, exam prep, or to maintain consistent progress week by week.",
    features: [
      "60-minute lesson",
      "Pre-lesson goal review",
      "Google Meet video call",
      "WhatsApp reminder 1hr before",
    ],
    cta: "Book a lesson",
    highlighted: true,
  },
  {
    id: "intensive",
    name: "Intensive",
    price: "₦25,000",
    duration: "90 min",
    tag: "Deep dive",
    description:
      "Extended sessions for complex topics, project walkthroughs, or students who prefer longer, deeper exploration.",
    features: [
      "90-minute lesson",
      "Pre-lesson goal review",
      "Google Meet video call",
      "WhatsApp reminder 1hr before",
    ],
    cta: "Book intensive",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-16 w-full max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-muted border border-border-light rounded-full text-xs font-medium text-text-secondary mb-4 hover:border-accent-blue/30 transition-colors mx-auto">
            <HugeIcon name="credit-card" size={16} className="text-accent-blue" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight tracking-tight mb-4 w-full text-center">
            Simple, <span className="italic text-accent-blue">transparent pricing</span>
          </h2>
          <p className="font-body text-base text-text-secondary leading-relaxed w-full max-w-xl mx-auto font-normal text-center">
            Choose the plan that best fits your learning pace. No hidden fees or recurring subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col p-8 rounded-[24px] transition-all duration-200 ${
                plan.highlighted
                  ? "bg-text-primary text-white border-2 border-text-primary shadow-md relative scale-105 z-10 hover:border-accent-blue"
                  : "bg-white text-text-primary border border-border-light shadow-sm hover:border-accent-blue/50"
              }`}
            >
              {plan.tag && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider mb-6 self-start ${
                    plan.highlighted
                      ? "bg-white/20 text-white"
                      : "bg-surface-muted text-text-secondary border border-border-light"
                  }`}
                >
                  {plan.tag}
                </span>
              )}

              <h3 className={`font-heading text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-text-primary"}`}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className={`font-heading text-4xl font-bold ${plan.highlighted ? "text-white" : "text-text-primary"}`}>
                  {plan.price}
                </span>
              </div>

              <span className={`font-body text-xs mb-6 ${plan.highlighted ? "text-gray-300" : "text-text-secondary"}`}>
                {plan.duration} session
              </span>

              <p className={`font-body text-sm leading-relaxed mb-8 ${plan.highlighted ? "text-gray-300" : "text-text-secondary"} font-normal w-full`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`font-body text-xs sm:text-sm flex items-center gap-2.5 ${plan.highlighted ? "text-gray-200" : "text-text-secondary"}`}>
                    <HugeIcon name="check" size={16} className="text-accent-blue" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup?redirect=/dashboard/book"
                id={`pricing-cta-${plan.id}`}
                className={`w-full py-3.5 px-6 rounded-full font-body text-sm font-medium text-center transition-colors duration-200 ${
                  plan.highlighted
                    ? "bg-white text-text-primary hover:bg-surface-near-white hover:text-accent-blue"
                    : "bg-text-primary text-white hover:bg-black"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
