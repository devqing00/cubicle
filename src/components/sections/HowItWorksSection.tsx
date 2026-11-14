"use client";

import React, { useState, useEffect } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";

const steps = [
  {
    num: "01",
    label: "Details & Goals",
    title: "Share your learning objectives",
    summary:
      "Tell us your current speaking level, preferred pace, and specific language goals (e.g., job relocation, travel fluency, or exam prep).",
    detail: "Direct questionnaire alignment ensures your instructor prepares custom speaking material for minute one.",
    previewType: "goals",
  },
  {
    num: "02",
    label: "Live Schedule",
    title: "Select your real available slot",
    summary:
      "Choose from the live calendar showing only verified free slots in West Africa Time (WAT). No back-and-forth emails.",
    detail: "Available 7 days a week with instant slot reservation and automatic timezone translation.",
    previewType: "slots",
  },
  {
    num: "03",
    label: "WhatsApp Chat",
    title: "Connect directly with your tutor",
    summary:
      "Your reservation automatically unlocks direct messaging with your instructor to confirm expectations and ask questions.",
    detail: "Instant introduction with your booking reference attached so you feel completely at ease before class.",
    previewType: "chat",
  },
  {
    num: "04",
    label: "Instant Payment",
    title: "Confirm slot securely",
    summary:
      "Complete payment with your choice of OPay, Debit Card, or Bank Transfer. Trials are 100% free with zero card required.",
    detail: "Bank-grade encryption with instant webhook verification to hold your calendar slot permanently.",
    previewType: "payment",
  },
  {
    num: "05",
    label: "Live Session",
    title: "Join Google Meet & speak",
    summary:
      "Receive automated reminders and your one-click Google Meet room link. Review notes are archived in your student portal.",
    detail: "High-definition 1-on-1 video call with real-time corrections, pronunciation feedback, and chat logs.",
    previewType: "meet",
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Smooth auto-advance every 5 seconds unless hovered/interacting
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentStep = steps[activeStep];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-blue font-bold">
            The 5-Step Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-[1.05] tracking-tight mt-1">
            From first click to <span className="italic text-accent-blue">fluent speech.</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-text-secondary mt-3 max-w-xl leading-relaxed font-normal">
            An intuitive 5-step journey engineered for zero friction, complete transparency, and measurable speaking progress.
          </p>
        </div>

        {/* Step Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  setIsPaused(true);
                }}
                className={`tactile-btn px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? "bg-text-primary text-white border-text-primary shadow-xs"
                    : "bg-white text-text-secondary border-border-light hover:text-text-primary hover:border-border-subtle"
                }`}
              >
                <span className={`font-mono text-[11px] ${isActive ? "text-accent-blue" : "text-text-subtle"}`}>
                  {step.num}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Interactive Showcase Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="tactile-card rounded-[32px] p-6 sm:p-10 md:p-12 bg-white border border-border-light shadow-sm transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Number & Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-4">
                <span className="font-heading text-6xl sm:text-7xl font-bold text-text-primary tracking-tighter leading-none select-none">
                  {currentStep.num}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent-blue font-bold">
                    Stage {currentStep.num} of 05
                  </span>
                  <h3 className="font-heading text-xl sm:text-3xl font-bold text-text-primary tracking-tight mt-0.5">
                    {currentStep.title}
                  </h3>
                </div>
              </div>

              <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
                {currentStep.summary}
              </p>

              <div className="p-4 bg-surface-near-white border border-border-light rounded-2xl flex items-start gap-3">
                <HugeIcon name="sparkles" size={18} className="text-accent-blue shrink-0 mt-0.5" />
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {currentStep.detail}
                </p>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
                    setIsPaused(true);
                  }}
                  className="tactile-btn p-2 rounded-full border border-border-light hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Previous step"
                >
                  <HugeIcon name="chevron-left" size={18} />
                </button>
                <span className="font-mono text-xs text-text-subtle">
                  {activeStep + 1} / {steps.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => (prev + 1) % steps.length);
                    setIsPaused(true);
                  }}
                  className="tactile-btn p-2 rounded-full border border-border-light hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Next step"
                >
                  <HugeIcon name="chevron-right" size={18} />
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Mockup Visuals */}
            <div className="lg:col-span-5 h-full flex flex-col justify-center">
              <div className="p-6 rounded-2xl bg-surface-near-white border border-border-light shadow-inner space-y-4">
                
                {currentStep.previewType === "goals" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold block">
                      Live Preview • Student Objectives
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Conversational Fluency", "DELE B2 Prep", "Business Vocabulary", "Pronunciation & Accent"].map((goal, i) => (
                        <div key={i} className="px-3 py-1.5 bg-white border border-border-light rounded-xl text-xs font-medium text-text-primary shadow-2xs">
                          {goal}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-accent-blue/5 border border-accent-blue/15 rounded-xl text-xs text-text-secondary flex items-center gap-2">
                      <HugeIcon name="check" size={15} className="text-accent-blue" />
                      <span>Customized speaking deck generated</span>
                    </div>
                  </div>
                )}

                {currentStep.previewType === "slots" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold block">
                      Live Preview • Free Slot Picker
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {["Today, 02:30 PM", "Today, 05:00 PM", "Tomorrow, 10:00 AM", "Tomorrow, 03:00 PM"].map((slot, i) => (
                        <div
                          key={i}
                          className={`py-2.5 px-2 rounded-xl text-center text-xs font-medium border ${
                            i === 0
                              ? "bg-accent-blue text-white font-bold border-accent-blue shadow-xs"
                              : "bg-white text-text-secondary border-border-light"
                          }`}
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-subtle text-center">
                      Auto-converts to your local timezone
                    </p>
                  </div>
                )}

                {currentStep.previewType === "chat" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold block">
                      Live Preview • Direct WhatsApp Link
                    </span>
                    <div className="p-3.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#128C7E]">
                        <span>WhatsApp Tutor Chat</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      </div>
                      <p className="text-xs text-text-primary leading-relaxed">
                        &quot;Hi Divine! I just booked session Ref: CUB-842. Looking forward to practicing conversation.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {currentStep.previewType === "payment" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold block">
                      Live Preview • Payment Channels
                    </span>
                    <div className="space-y-2">
                      {["OPay & Mobile Wallets", "Mastercard & Visa", "Instant Bank Transfer"].map((ch, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-border-light rounded-xl text-xs font-bold text-text-primary">
                          <span>{ch}</span>
                          <HugeIcon name="check" size={15} className="text-emerald-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep.previewType === "meet" && (
                  <div className="space-y-3 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold block">
                      Live Preview • Meeting Access
                    </span>
                    <div className="p-4 bg-white border border-border-light rounded-xl space-y-2">
                      <div className="w-10 h-10 rounded-full bg-accent-blue/10 text-accent-blue flex items-center justify-center mx-auto">
                        <HugeIcon name="video" size={20} />
                      </div>
                      <h5 className="font-heading font-bold text-xs text-text-primary">
                        meet.google.com/cub-spn
                      </h5>
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full">
                        Room Issued & Verified
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="pt-6 mt-6 border-t border-border-light flex items-center justify-between text-xs text-text-subtle font-mono flex-wrap gap-3">
            <span>Stage {currentStep.num} of 05 — {currentStep.label}</span>
            <Link
              href="/signup?redirect=/dashboard/book"
              className="tactile-btn btn-tactile-primary px-5 py-2.5 rounded-full text-xs font-semibold text-white inline-flex items-center gap-1.5"
            >
              <span>Claim Free Trial</span>
              <HugeIcon name="arrow-right" size={13} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
