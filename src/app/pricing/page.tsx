"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PricingPage() {
  useSmoothScroll();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pricing-page-hero", {
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });

      gsap.from(".pricing-page-card", {
        opacity: 0,
        y: 35,
        duration: 0.75,
        stagger: 0.1,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: ".pricing-page-grid",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      gsap.from(".pricing-page-faq", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: ".pricing-page-faq",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

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
    <div ref={pageRef} className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[1100px] mx-auto w-full">
          
          {/* Header */}
          <div className="pricing-page-hero text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              Simple plans. <span className="italic text-accent-blue">No subscriptions.</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              Pay per session with zero hidden commitments. Start with a completely free trial lesson today.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-page-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`pricing-page-card tactile-card swiss-lift p-8 sm:p-9 rounded-[32px] flex flex-col justify-between relative ${
                  tier.popular ? "tactile-card-dark md:scale-[1.03] z-10" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-heading text-2xl font-bold ${tier.popular ? "text-white" : "text-text-primary"}`}>
                      {tier.name}
                    </h3>
                    {tier.popular && (
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/15 px-2.5 py-1 rounded-full border border-accent-blue/30">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className={`font-body text-xs mb-6 ${tier.popular ? "text-slate-300" : "text-text-secondary"}`}>
                    {tier.desc}
                  </p>
                  
                  <div className={`mb-6 pb-6 border-b ${tier.popular ? "border-white/10" : "border-border-light"}`}>
                    <span className={`font-heading text-4xl font-bold ${tier.popular ? "text-white" : "text-text-primary"}`}>
                      {tier.price}
                    </span>
                    <span className={`font-body text-xs ml-1 ${tier.popular ? "text-slate-400" : "text-text-secondary"}`}>
                      {tier.period}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className={`flex items-start gap-2.5 text-xs font-medium ${tier.popular ? "text-slate-200" : "text-text-primary"}`}>
                        <HugeIcon name="check" size={16} className="text-accent-blue shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/signup?redirect=/dashboard/book"
                  className={`tactile-btn w-full py-3.5 text-center rounded-full font-body text-xs font-semibold ${
                    tier.popular
                      ? "btn-tactile-primary"
                      : "btn-tactile-dark"
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing FAQ Section */}
          <div className="pricing-page-faq tactile-card p-8 sm:p-12 rounded-[32px] max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="pb-6 border-b border-border-light">
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">Is the first lesson really 100% free?</h4>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">Yes! Your first trial lesson is completely free with zero payment details required upfront. Simply pick a time slot and show up on Google Meet.</p>
              </div>
              <div className="pb-6 border-b border-border-light">
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">What payment methods are supported?</h4>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">We process payments securely via Bachs and Paystack, supporting bank transfers, debit cards, mobile money, and Apple Pay.</p>
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
