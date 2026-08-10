"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function PricingPage() {
  const tiers = [
    {
      id: "trial",
      name: "Free Trial",
      price: "₦0",
      period: "1 session limit",
      desc: "Perfect for testing out our teaching method and meeting your instructor.",
      features: [
        "Full 30-minute trial session",
        "Instant Google Meet video link",
        "WhatsApp lesson feedback",
        "Zero payment upfront",
      ],
      popular: false,
      ctaText: "Claim Free Trial",
    },
    {
      id: "standard",
      name: "Standard Lesson",
      price: "₦15,000",
      period: "per 60m session",
      desc: "Comprehensive 1-on-1 language instruction tailored to your goals.",
      features: [
        "Full 60-minute 1-on-1 session",
        "Dedicated native language instructor",
        "Instant Google Meet link issued",
        "Post-lesson vocabulary & notes",
        "24-hour free rescheduling policy",
      ],
      popular: true,
      ctaText: "Book Standard Session",
    },
    {
      id: "intensive",
      name: "Intensive Session",
      price: "₦25,000",
      period: "per 90m session",
      desc: "Accelerated deep-dive for exam prep, interviews, or rapid fluency.",
      features: [
        "Extended 90-minute immersion",
        "Advanced grammar & accent breakdown",
        "Custom curriculum & homework tasks",
        "Priority instructor Q&A on WhatsApp",
        "24-hour free rescheduling policy",
      ],
      popular: false,
      ctaText: "Book Intensive Session",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[1100px] mx-auto w-full">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider border border-accent-blue/20 mb-4 inline-block">
              Transparent Pricing
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              Simple plans. <span className="italic text-accent-blue">No subscriptions.</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              Pay per session with zero hidden commitments. Start with a completely free trial lesson today.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white p-8 rounded-[28px] border shadow-xs flex flex-col justify-between relative ${
                  tier.popular ? "border-accent-blue shadow-md ring-1 ring-accent-blue/30" : "border-border-light"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent-blue text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">{tier.name}</h3>
                  <p className="font-body text-xs text-text-secondary mb-6">{tier.desc}</p>
                  
                  <div className="mb-6 pb-6 border-b border-border-light">
                    <span className="font-heading text-4xl font-bold text-text-primary">{tier.price}</span>
                    <span className="font-body text-xs text-text-secondary ml-1">{tier.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-text-primary font-medium">
                        <HugeIcon name="check" size={16} className="text-accent-blue shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/signup?redirect=/dashboard/book"
                  className={`w-full py-3.5 text-center rounded-full font-body text-xs font-semibold transition-all ${
                    tier.popular
                      ? "bg-accent-blue text-white hover:bg-blue-600 shadow-xs"
                      : "bg-text-primary text-white hover:bg-black"
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing FAQ Section */}
          <div className="bg-white p-8 sm:p-12 rounded-[28px] border border-border-light shadow-xs max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="pb-6 border-b border-border-light">
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">Is the first lesson really 100% free?</h4>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">Yes! Your first trial lesson is completely free with zero payment details required upfront. Simply pick a time slot and show up on Google Meet.</p>
              </div>
              <div className="pb-6 border-b border-border-light">
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">What payment methods are supported?</h4>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">We process payments securely via Paystack, supporting bank transfers, debit cards, Apple Pay, and USSD.</p>
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">What if I need to reschedule my session?</h4>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">Paid lessons can be rescheduled free of charge if requested more than 24 hours prior to the session start time.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
