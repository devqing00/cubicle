"use client";

import React, { useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Blueprint: True 3D Stacked Card Deck with Calibrated Headroom and Heavy Tactile Scroll Pressure
  useGSAP(
    () => {
      if (typeof window === "undefined" || !sectionRef.current) return;
      const totalCards = steps.length;

      // Heavy scroll distance (280vh per card) and deep scrub damping (2.2) for substantial physical scroll resistance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalCards * 280}vh`,
          pin: true,
          scrub: 2.2,
          anticipatePin: 1,
        },
      });

      // Card 0 starts in center. Subsequent cards start below with opacity 0
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        if (index > 0) {
          gsap.set(card, {
            yPercent: 110,
            scale: 0.95,
            opacity: 0,
            pointerEvents: "none",
          });
        }
      });

      // Chain the 3D stacking timeline with wide 2.6s plateaus so each card requires deliberate scroll pressure
      cardRefs.current.forEach((card, index) => {
        if (index === 0 || !card) return;
        const arrivalTime = index * 3.8;

        tl.to(
          card,
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            pointerEvents: "auto",
            duration: 1.2,
            ease: "power2.out",
          },
          arrivalTime
        )
        // Previous cards tuck upward with a micro 4px offset (guaranteeing 80px+ clear margin below header description)
        .to(
          cardRefs.current.slice(0, index),
          {
            scale: (i) => 1 - (index - i) * 0.035,
            y: (i) => -(index - i) * 4,
            filter: (i) => `brightness(${1 - (index - i) * 0.08})`,
            duration: 1.2,
            ease: "power2.out",
          },
          arrivalTime
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-surface-near-white min-h-screen select-none"
    >
      <div
        ref={containerRef}
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 flex flex-col justify-start"
      >
        {/* Header with Generous Bottom Separation (Zero collision with deck) */}
        <div className="max-w-3xl mb-24 sm:mb-32">
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

        {/* 3D Stack Viewport (Safe Headroom: cards stack with micro 4px tuck and never touch the header) */}
        <div className="relative w-full max-w-4xl h-[460px] sm:h-[480px] mx-auto perspective-[1200px]">
          
          {/* Luminous Ambient Glow behind the deck */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-sky-400/15 blur-[100px] rounded-full pointer-events-none -z-10" />

          {steps.map((step, idx) => (
            <div
              key={step.num}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)] bg-white border border-border-light will-change-transform flex flex-col justify-between overflow-hidden"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: (idx + 1) * 10,
                transformOrigin: "top center",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center h-full">
                
                {/* Left Column: Number & Narrative */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-5xl sm:text-7xl font-bold text-text-primary tracking-tighter leading-none select-none">
                      {step.num}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-accent-blue font-bold">
                        Stage {step.num} of 05
                      </span>
                      <h3 className="font-heading text-lg sm:text-2xl font-bold text-text-primary tracking-tight mt-0.5">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                    {step.summary}
                  </p>

                  <div className="p-3.5 bg-surface-near-white border border-border-light rounded-2xl flex items-start gap-2.5">
                    <HugeIcon name="sparkles" size={16} className="text-accent-blue shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-text-secondary leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>

                {/* Right Column: Live Mockup Visuals */}
                <div className="lg:col-span-5 h-full flex flex-col justify-center">
                  <div className="p-5 sm:p-6 rounded-2xl bg-surface-near-white border border-border-light shadow-inner space-y-3">
                    
                    {step.previewType === "goals" && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold">
                          Live Preview • Student Objectives
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {["Conversational Fluency", "DELE B2 Prep", "Business Vocabulary", "Pronunciation & Accent"].map((goal, i) => (
                            <div key={i} className="px-2.5 py-1 bg-white border border-border-light rounded-lg text-xs font-medium text-text-primary shadow-2xs">
                              {goal}
                            </div>
                          ))}
                        </div>
                        <div className="p-2.5 bg-accent-blue/5 border border-accent-blue/15 rounded-xl text-xs text-text-secondary flex items-center gap-2">
                          <HugeIcon name="check" size={14} className="text-accent-blue" />
                          <span>Customized speaking deck generated</span>
                        </div>
                      </div>
                    )}

                    {step.previewType === "slots" && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold">
                          Live Preview • Free Slot Picker
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {["Today, 02:30 PM", "Today, 05:00 PM", "Tomorrow, 10:00 AM", "Tomorrow, 03:00 PM"].map((slot, i) => (
                            <div
                              key={i}
                              className={`py-2 px-2 rounded-xl text-center text-xs font-medium border ${
                                i === 0
                                  ? "bg-accent-blue text-white font-bold border-accent-blue shadow-xs"
                                  : "bg-white text-text-secondary border-border-light"
                              }`}
                            >
                              {slot}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-text-subtle text-center">
                          Auto-converts to West Africa Time (WAT)
                        </p>
                      </div>
                    )}

                    {step.previewType === "chat" && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold">
                          Live Preview • Direct WhatsApp Link
                        </span>
                        <div className="p-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#128C7E]">
                            <span>WhatsApp Tutor Chat</span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Online
                            </span>
                          </div>
                          <p className="text-xs text-text-primary">
                            &quot;Hi Divine! I just booked session Ref: CUB-842. Looking forward to practicing conversation.&quot;
                          </p>
                        </div>
                      </div>
                    )}

                    {step.previewType === "payment" && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold">
                          Live Preview • Payment Channels
                        </span>
                        <div className="space-y-1.5">
                          {["OPay & Mobile Wallets", "Mastercard & Visa", "Instant Bank Transfer"].map((ch, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 bg-white border border-border-light rounded-xl text-xs font-bold text-text-primary">
                              <span>{ch}</span>
                              <HugeIcon name="check" size={14} className="text-emerald-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.previewType === "meet" && (
                      <div className="space-y-3 text-center">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-subtle font-semibold">
                          Live Preview • Meeting Access
                        </span>
                        <div className="p-3 bg-white border border-border-light rounded-xl space-y-2">
                          <div className="w-9 h-9 rounded-full bg-accent-blue/10 text-accent-blue flex items-center justify-center mx-auto">
                            <HugeIcon name="video" size={18} />
                          </div>
                          <h5 className="font-heading font-bold text-xs text-text-primary">
                            meet.google.com/cub-spn
                          </h5>
                          <span className="inline-block px-3 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                            Room Issued & Verified
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Card Footer Bar (Zero Hairlines) */}
              <div className="pt-4 flex items-center justify-between text-xs text-text-subtle font-mono">
                <span>Stage {step.num} of 05 — {step.label}</span>
                <Link
                  href="/signup?redirect=/dashboard/book"
                  className="tactile-btn btn-tactile-primary px-5 py-2 rounded-full text-xs font-semibold text-white inline-flex items-center gap-1.5"
                >
                  <span>Claim Free Trial</span>
                  <HugeIcon name="arrow-right" size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
