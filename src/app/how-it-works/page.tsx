"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Pick Your Ideal Session & Slot",
      desc: "Select between a 60-minute Standard or 90-minute Intensive session. Browse real-time tutor availability calendars and pick a date that fits your life.",
      icon: "calendar" as const,
    },
    {
      num: "02",
      title: "Instant Google Meet Link Delivery",
      desc: "Upon confirming your booking slot, a unique Google Meet video link is generated immediately and synced to your dashboard and calendar.",
      icon: "video" as const,
    },
    {
      num: "03",
      title: "1-on-1 Live Conversation Session",
      desc: "Join your instructor in a private, distraction-free virtual classroom. Practice live speaking, accent correction, and real-world vocabulary exercises.",
      icon: "brain" as const,
    },
    {
      num: "04",
      title: "Post-Session WhatsApp Feedback",
      desc: "Receive personalized feedback notes, vocabulary lists, and optional practice assignments directly on WhatsApp right after your session.",
      icon: "comment" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[1000px] mx-auto w-full">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider border border-accent-blue/20 mb-4 inline-block">
              Step-by-Step Experience
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              How Cubicle brings language learning <span className="italic text-accent-blue">to life.</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              No complicated software downloads or rigid schedules. Four simple steps to start speaking fluently with dedicated instructors.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {steps.map((step) => (
              <div key={step.num} className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col justify-between group hover:border-accent-blue/40 transition-colors">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-2xl font-bold text-accent-blue">{step.num}</span>
                    <div className="w-10 h-10 bg-surface-muted rounded-xl border border-border-light flex items-center justify-center text-text-primary group-hover:text-accent-blue transition-colors">
                      <HugeIcon name={step.icon} size={20} />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-text-primary mb-2">{step.title}</h3>
                  <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tech & Hardware Requirements */}
          <div className="bg-white p-8 sm:p-12 rounded-[28px] border border-border-light shadow-xs mb-16">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">What You Need for Your First Lesson</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-surface-near-white rounded-2xl border border-border-light">
                <HugeIcon name="video" size={24} className="text-accent-blue mb-3" />
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">Webcam & Microphone</h4>
                <p className="font-body text-xs text-text-secondary">Any standard built-in laptop camera and microphone works great.</p>
              </div>
              <div className="p-5 bg-surface-near-white rounded-2xl border border-border-light">
                <HugeIcon name="navigation" size={24} className="text-accent-blue mb-3" />
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">Stable Internet</h4>
                <p className="font-body text-xs text-text-secondary">Broadband connection capable of smooth HD Google Meet video calls.</p>
              </div>
              <div className="p-5 bg-surface-near-white rounded-2xl border border-border-light">
                <HugeIcon name="comment" size={24} className="text-accent-blue mb-3" />
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">WhatsApp Account</h4>
                <p className="font-body text-xs text-text-secondary">For instant booking reference verification and lesson notes.</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center bg-surface-muted p-10 rounded-[28px] border border-border-light">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">Ready to test it out?</h2>
            <p className="font-body text-xs sm:text-sm text-text-secondary mb-6">Your first trial lesson is completely free. No credit card required.</p>
            <Link
              href="/signup?redirect=/dashboard/book"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors"
            >
              <span>Book Your Free Trial</span>
              <HugeIcon name="arrow-right" size={14} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
