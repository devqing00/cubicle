"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import HugeIcon from "@/components/ui/HugeIcon";

// Pure 3D Composite-only transform styles (Zero Layout Reflows & 100% GPU Hardware Accelerated)
const positionStyles = [
  {
    transform: "translate3d(-250px, 20px, -100px) rotate(-6deg) scale(0.88)",
    opacity: 0.5,
    zIndex: 10,
  },
  {
    transform: "translate3d(0px, 0px, 0px) rotate(0deg) scale(1)",
    opacity: 1,
    zIndex: 30,
  },
  {
    transform: "translate3d(250px, 20px, -100px) rotate(6deg) scale(0.88)",
    opacity: 0.5,
    zIndex: 10,
  },
];

const dialogues = [
  "¡Hola! Let's practice today's dialogue.",
  "Perfect pronunciation on past tense verbs!",
  "Great job! Ready for a quick recap?"
];

const feedbackNotes = [
  "\"Excellent pronunciation on rolling R sounds today! Next class: past tense verbs.\"",
  "\"Great confidence in free speaking! Working on subjunctive mood next session.\"",
  "\"Spot-on vocabulary usage! Practice the 5 new idioms before Thursday.\""
];

export default function HeroSection() {
  const [cycle, setCycle] = useState(0);

  // Independent staggered animation states for each card
  const [slotIndex, setSlotIndex] = useState(1);
  const [dateIndex, setDateIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialogueKey, setDialogueKey] = useState(0);
  const [timerCount, setTimerCount] = useState(18);
  const [fluencyIndex, setFluencyIndex] = useState(1);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [skillIndex, setSkillIndex] = useState(0);

  // Main 3D Card Flipping Cycle (every 4 seconds)
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCycle((c) => c + 1);
    }, 4000);
    return () => clearInterval(cycleInterval);
  }, []);

  // Card 1: Independent slot selector timeline (every 2.5s)
  useEffect(() => {
    const slotInterval = setInterval(() => {
      setSlotIndex((s) => (s + 1) % 3);
    }, 2500);

    const dateInterval = setInterval(() => {
      setDateIndex((d) => (d + 1) % 2);
    }, 5000);

    return () => {
      clearInterval(slotInterval);
      clearInterval(dateInterval);
    };
  }, []);

  // Card 2: Independent live session & dialogue timeline (every 3.6s + continuous 1s timer)
  useEffect(() => {
    const dialogueInterval = setInterval(() => {
      setDialogueIndex((d) => (d + 1) % dialogues.length);
      setDialogueKey((k) => k + 1);
    }, 3600);

    const timerInterval = setInterval(() => {
      setTimerCount((t) => (t >= 59 ? 10 : t + 1));
    }, 1000);

    return () => {
      clearInterval(dialogueInterval);
      clearInterval(timerInterval);
    };
  }, []);

  // Card 3: Independent progress & feedback timeline (every 3.2s & 2.1s)
  useEffect(() => {
    const fluencyInterval = setInterval(() => {
      setFluencyIndex((f) => (f + 1) % 3);
      setFeedbackIndex((b) => (b + 1) % feedbackNotes.length);
    }, 3200);

    const skillInterval = setInterval(() => {
      setSkillIndex((s) => (s + 1) % 2);
    }, 2100);

    return () => {
      clearInterval(fluencyInterval);
      clearInterval(skillInterval);
    };
  }, []);

  const fluencyValues = ["84%", "91%", "97%"];

  const cards = [
    {
      id: "booking-card",
      content: (
        <>
          {/* Card Header: Slot Selector & Tutor Profile */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xs">
                    AA
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-text-primary leading-tight">Alexander Adetayo</h4>
                  <p className="font-body text-[11px] text-text-secondary">Language Instructor</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                slotIndex === 1 ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/30 scale-105" : "bg-surface-muted border border-border-light text-text-secondary scale-100"
              }`}>
                60 min
              </span>
            </div>

            {/* Time Slot Options with Viral AE Overshoot Spring Easing */}
            <div className="space-y-2 mb-4">
              <div className="text-[11px] font-medium text-text-secondary flex justify-between items-center">
                <span>Available Slots</span>
                <span className="font-semibold text-accent-blue transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  {dateIndex === 0 ? "Today, Aug 10" : "Tomorrow, Aug 11"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { time: "10:00 AM", idx: 0 },
                  { time: "02:30 PM", idx: 1 },
                  { time: "05:00 PM", idx: 2 },
                ].map((slot) => {
                  const isSelected = slotIndex === slot.idx;
                  return (
                    <div
                      key={slot.time}
                      className={`py-2 px-1 text-center text-xs rounded-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-accent-blue text-white font-semibold shadow-md border border-accent-blue scale-[1.08] -translate-y-0.5"
                          : "bg-surface-near-white text-text-secondary border border-border-light font-medium scale-100 translate-y-0 hover:bg-surface-muted"
                      }`}
                    >
                      <span>{slot.time}</span>
                      {isSelected && (
                        <HugeIcon name="check" size={12} className="text-white animate-bounce shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Animated Instant Booking Banner */}
          <div className="p-3 bg-surface-muted/70 border border-border-light rounded-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                <HugeIcon name="calendar" size={14} className="text-accent-blue" />
                <span>Instant Google Meet</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500 animate-ping" />
            </div>
            <p className="font-body text-[11px] text-text-secondary leading-relaxed">
              Link issued upon booking.
            </p>
          </div>

          {/* Action Footer with Bouncy Arrow */}
          <div className="w-full py-2.5 px-4 bg-text-primary text-white rounded-full font-body text-xs font-medium flex items-center justify-between group">
            <span>Confirm Trial Session</span>
            <HugeIcon
              name="arrow-right"
              size={14}
              className={`text-accent-blue transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                slotIndex === 1 ? 'translate-x-1.5' : 'translate-x-0'
              }`}
            />
          </div>
        </>
      )
    },
    {
      id: "live-session-card",
      content: (
        <>
          {/* Card Header: Live Meeting & Continuous Timer Counter */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div className="absolute w-4 h-4 rounded-full bg-emerald-500/40 animate-ping" />
                </div>
                <span className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider">
                  Live 1-on-1 Lesson
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-accent-blue/10 text-accent-blue border border-accent-blue/20 font-mono">
                00:24:{timerCount < 10 ? `0${timerCount}` : timerCount}
              </span>
            </div>

            {/* Video Call Mockup Container */}
            <div className="w-full h-[175px] bg-gradient-to-br from-[#0c1836] via-[#07132e] to-[#040a17] rounded-xl border border-blue-900/40 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              
              {/* Top Room Tag & Continuous Organic Audio Waveform */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-blue-200/80 bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs">
                  meet.google.com/cub-spn
                </span>
                
                {/* 5-Bar Fluid Continuous Audio Wave Equalizer */}
                <div className="flex gap-1 items-end h-5">
                  <div className="w-1 bg-accent-blue rounded-t animate-[eqWave_0.8s_ease-in-out_infinite_alternate]" />
                  <div className="w-1 bg-accent-blue rounded-t animate-[eqWave_1.2s_ease-in-out_infinite_alternate_0.2s]" />
                  <div className="w-1 bg-accent-blue rounded-t animate-[eqWave_0.95s_ease-in-out_infinite_alternate_0.4s]" />
                  <div className="w-1 bg-accent-blue rounded-t animate-[eqWave_1.3s_ease-in-out_infinite_alternate_0.15s]" />
                  <div className="w-1 bg-accent-blue rounded-t animate-[eqWave_0.75s_ease-in-out_infinite_alternate_0.3s]" />
                </div>
              </div>

              {/* Dynamic Rotating Chat Dialogue Bubble with Viral AE Pop Bounce */}
              <div
                key={dialogueKey}
                className="bg-white/10 border border-white/20 backdrop-blur-md p-2.5 rounded-lg text-white space-y-1 transform animate-[aeBubblePop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
              >
                <div className="flex items-center justify-between text-[10px] text-blue-200">
                  <span className="font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Alexander (Tutor)
                  </span>
                  <span className="text-[9px] opacity-75">Speaking</span>
                </div>
                <p className="text-[11px] font-normal leading-snug text-slate-100">
                  {dialogues[dialogueIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Integration Status */}
          <div className="flex items-center justify-between p-3 bg-surface-near-white border border-border-light rounded-xl">
            <div className="flex items-center gap-2">
              <HugeIcon name="comment" size={16} className="text-accent-blue animate-bounce" />
              <div className="text-[11px]">
                <p className="font-bold text-text-primary">Direct WhatsApp Active</p>
                <p className="text-text-secondary text-[10px]">Real-time lesson feedback</p>
              </div>
            </div>
            <HugeIcon name="check" size={16} className="text-emerald-600" />
          </div>

          {/* Footer Callout with Continuous Sparkle Spin */}
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-surface-muted rounded-full text-xs font-semibold text-text-primary">
            <HugeIcon name="sparkles" size={14} className="text-accent-blue animate-[spin_6s_linear_infinite]" />
            <span>Interactive Speaking Practice</span>
          </div>
        </>
      )
    },
    {
      id: "feedback-card",
      content: (
        <>
          {/* Card Header: Progress & Notes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HugeIcon name="brain" size={18} className="text-accent-blue" />
                <h4 className="font-heading text-xs font-bold text-text-primary">Personalized Progress</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-blue text-white shadow-xs">
                Lesson #3
              </span>
            </div>

            {/* Dynamic Fluency Meter Fill with Liquid Bouncy Spring */}
            <div className="p-3.5 bg-surface-near-white border border-border-light rounded-xl space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-text-secondary">Fluency & Vocabulary</span>
                <span className="font-bold text-accent-blue font-mono transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  {fluencyValues[fluencyIndex]}
                </span>
              </div>
              <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-blue rounded-full transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ width: fluencyValues[fluencyIndex] }}
                />
              </div>
            </div>

            {/* Tutor Feedback Note with AE Bouncy Spring Pop */}
            <div
              key={feedbackIndex}
              className="p-3 bg-surface-muted/80 border border-border-light rounded-xl space-y-1.5 animate-[aeBubblePop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
            >
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Instructor Insight</span>
              <p className="font-body text-[11px] text-text-primary leading-relaxed font-normal">
                {feedbackNotes[feedbackIndex]}
              </p>
            </div>
          </div>

          {/* Rotating Skill Badges with Independent Overshoot Bounce */}
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              skillIndex === 0
                ? "bg-accent-blue/10 border border-accent-blue/40 text-accent-blue font-bold scale-[1.08] shadow-xs"
                : "bg-surface-near-white border border-border-light text-text-secondary scale-100"
            }`}>
              Grammar Breakdown
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              skillIndex === 1
                ? "bg-accent-blue/10 border border-accent-blue/40 text-accent-blue font-bold scale-[1.08] shadow-xs"
                : "bg-surface-near-white border border-border-light text-text-secondary scale-100"
            }`}>
              Accent Practice
            </span>
          </div>

          {/* Bottom Reminder Card */}
          <div className="w-full py-2.5 px-4 bg-white border border-border-subtle rounded-full text-xs font-semibold text-text-primary flex items-center justify-between group">
            <span>Next Session Scheduled</span>
            <HugeIcon name="calendar" size={14} className="text-accent-blue" />
          </div>
        </>
      )
    }
  ];

  return (
    <section
      id="hero"
      className="pt-[140px] pb-[80px] max-md:pt-[100px] relative overflow-hidden bg-surface-near-white min-h-[640px]"
    >
      {/* Background Mesh Gradient (Landscape for all viewports) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Image
          src="/images/hero_bg_land.png"
          alt="Hero Background"
          fill
          className="object-cover object-center opacity-90"
          priority
        />
        {/* Soft Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-near-white via-surface-near-white/60 to-transparent" />
      </div>

      {/* Inline Scoped AE Viral Motion Keyframes */}
      <style jsx global>{`
        @keyframes eqWave {
          0% { height: 4px; }
          100% { height: 20px; }
        }
        @keyframes aeBubblePop {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.94);
          }
          65% {
            opacity: 1;
            transform: translateY(-2px) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 w-full text-center">
        
        {/* Header & Tagline */}
        <div className="w-full max-w-4xl mx-auto mb-12 text-center">
          <h1 className="font-heading text-4xl sm:text-6xl md:text-[76px] font-bold text-text-primary leading-[1.05] tracking-tight mb-6 w-full text-center">
            Learn. Speak. <span className="italic text-accent-blue">Succeed.</span>
          </h1>
          
          <p className="font-body text-base sm:text-lg md:text-xl text-text-secondary w-full max-w-2xl mx-auto mb-8 leading-relaxed font-normal text-center">
            Master new languages with interactive 1-on-1 sessions. Connect directly with your instructor, pick slots that fit your life, and achieve your learning goals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup?redirect=/dashboard/book"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-text-primary text-white rounded-full font-body text-sm font-medium hover:bg-black transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>Start Free Trial</span>
              <HugeIcon name="arrow-right" size={16} />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-text-primary border border-border-light rounded-full font-body text-sm font-medium hover:border-accent-blue/50 hover:text-accent-blue transition-colors duration-200"
            >
              <span>How It Works</span>
            </Link>
          </div>
        </div>

        {/* 100% GPU Composite 3D Motion Cards Container */}
        <div 
          className="relative w-full h-[460px] mt-4 mb-6 perspective-[1200px] transform scale-100 max-[900px]:scale-[0.8] max-sm:scale-[0.55] max-sm:-mt-[100px] max-sm:-mb-[80px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {cards.map((card, idx) => {
            const posIndex = (idx + cycle) % 3;
            const style = positionStyles[posIndex];

            return (
              <div
                key={card.id}
                style={{
                  transform: style.transform,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                  transition: "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden"
                }}
                className="absolute left-1/2 top-0 -translate-x-1/2 w-[340px] h-[450px] bg-white p-6 border border-border-subtle rounded-2xl gap-4 flex flex-col justify-between select-none shadow-xl"
              >
                {card.content}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
