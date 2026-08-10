"use client";

import React, { useState } from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "booking" | "payments" | "sessions" | "policy">("all");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      cat: "booking",
      q: "How does the free trial work?",
      a: "Simply click 'Start Free Trial', choose a date and time slot, and confirm. A unique Google Meet link will be generated instantly for your 30-minute introductory lesson with no credit card required.",
    },
    {
      cat: "booking",
      q: "Can I choose my instructor?",
      a: "Yes! During slot selection, you can view instructor profiles, teaching experience, and native language accents to select the tutor that best fits your goals.",
    },
    {
      cat: "payments",
      q: "Are there recurring monthly subscription charges?",
      a: "No. Cubicle operates on a pay-per-session model. You only pay for the individual 60-minute or 90-minute lessons you schedule.",
    },
    {
      cat: "payments",
      q: "What payment gateways do you use?",
      a: "All payments are processed securely via Paystack, supporting bank transfers, debit cards, USSD, and Apple Pay.",
    },
    {
      cat: "sessions",
      q: "Do I need to install any special software?",
      a: "No software downloads are required! All 1-on-1 live lessons take place inside Google Meet, which opens directly in your web browser or mobile app.",
    },
    {
      cat: "sessions",
      q: "How do I receive my post-lesson notes?",
      a: "After each completed session, your tutor sends key vocabulary words, grammar tips, and optional homework exercises directly to your WhatsApp number.",
    },
    {
      cat: "policy",
      q: "What is the cancellation and rescheduling policy?",
      a: "You can reschedule any paid lesson for free if requested at least 24 hours prior to session start. Cancellations made under 24 hours or no-shows are non-refundable.",
    },
  ];

  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter((f) => f.cat === activeCategory);

  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[900px] mx-auto w-full">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3.5 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider border border-accent-blue/20 mb-4 inline-block">
              Help & Answers
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-[1.1] mb-4">
              Frequently Asked <span className="italic text-accent-blue">Questions.</span>
            </h1>
            <p className="font-body text-sm sm:text-base text-text-secondary">
              Everything you need to know about booking, Google Meet sessions, and payments.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: "all", label: "All Questions" },
              { id: "booking", label: "Booking & Trial" },
              { id: "payments", label: "Payments" },
              { id: "sessions", label: "Google Meet Sessions" },
              { id: "policy", label: "Rescheduling Policy" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "bg-text-primary text-white shadow-xs"
                    : "bg-white text-text-secondary border border-border-light hover:bg-surface-muted hover:text-text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 mb-16">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-[20px] border border-border-light shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-surface-near-white/60 transition-colors"
                  >
                    <span className="font-heading font-bold text-base text-text-primary">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-primary shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-accent-blue/10 text-accent-blue' : ''}`}>
                      <HugeIcon name="chevron-left" size={16} className="-rotate-90" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 border-t border-border-light/60">
                      <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed pt-4 font-normal">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still have questions CTA */}
          <div className="text-center bg-white p-8 sm:p-10 rounded-[28px] border border-border-light shadow-xs">
            <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Still have questions?</h3>
            <p className="font-body text-xs text-text-secondary mb-6">Our team is always available to assist you directly on WhatsApp.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors"
            >
              <span>Contact Support</span>
              <HugeIcon name="arrow-right" size={14} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
