"use client";

import React, { useState, useEffect } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import NumberTicker from "@/components/ui/NumberTicker";

type ConsoleTab = "hours" | "fluency" | "flexibility" | "attention";

interface CEFRMilestone {
  level: string;
  badge: string;
  timeline: string;
  speakingAbility: string;
  sampleDialogue: string;
  examTarget: string;
}

const cefrMilestones: CEFRMilestone[] = [
  {
    level: "A1",
    badge: "Beginner",
    timeline: "Weeks 1–3",
    speakingAbility: "Introduce yourself, order at Madrid cafes, and ask for directions without panic.",
    sampleDialogue: "— ¿Nos trae la cuenta y dos cafés con leche, por favor?",
    examTarget: "DELE A1 Oral Benchmark",
  },
  {
    level: "A2",
    badge: "Elementary",
    timeline: "Weeks 4–6",
    speakingAbility: "Describe past travel memories, weekend plans, and daily routines with natural cadence.",
    sampleDialogue: "— El fin de semana pasado fuimos a la sierra y el clima estuvo increíble.",
    examTarget: "DELE A2 / Basic Conversational",
  },
  {
    level: "B1",
    badge: "Intermediate",
    timeline: "Weeks 7–10",
    speakingAbility: "Express spontaneous opinions, debate cultural topics, and handle unexpected phone calls.",
    sampleDialogue: "— No creo que esa sea la mejor estrategia si consideramos los costes actuales.",
    examTarget: "DELE B1 / TEF Oral Section A",
  },
  {
    level: "B2",
    badge: "Professional Working",
    timeline: "Weeks 11–16",
    speakingAbility: "Lead complex workplace meetings, defend proposals, and master subjunctive verb moods.",
    sampleDialogue: "— Aunque haya incertidumbre regulatoria, sugiero que procedamos con el lanzamiento piloto.",
    examTarget: "DELE B2 Certified / TEF CLB 7+",
  },
  {
    level: "C1",
    badge: "Full Executive Fluency",
    timeline: "Weeks 17+",
    speakingAbility: "Deliver high-stakes boardroom presentations, subtle idioms, and persuasive negotiations.",
    sampleDialogue: "— Huelga decir que la sinergia entre ambos equipos determinará el éxito del proyecto.",
    examTarget: "Executive Business Level / DELE C1",
  },
];

export default function FluencyConsole() {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("fluency");
  const [selectedCefr, setSelectedCefr] = useState(3); // Default to B2
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [rescheduleState, setRescheduleState] = useState<"current" | "shifted">("current");

  // Waveform heights simulation
  const [waveHeights, setWaveHeights] = useState<number[]>([
    24, 45, 18, 52, 35, 60, 22, 40, 55, 30, 48, 20, 65, 38, 25, 50, 32, 58, 28, 44,
  ]);

  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 50) + 15)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const milestone = cefrMilestones[selectedCefr];

  return (
    <div className="w-full bg-[#0d121c] border border-white/10 rounded-[32px] p-6 sm:p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
      
      {/* Background Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header & Controller Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 relative z-10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-bold block mb-1">
            Interactive Fluency Lab
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            See what 1-on-1 fluency actually looks like.
          </h3>
        </div>

        {/* 4 Interactive Modes Controller */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl self-start md:self-auto w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("fluency")}
            className={`tactile-btn py-2 px-3.5 rounded-xl text-xs font-semibold transition-all text-center ${
              activeTab === "fluency"
                ? "bg-sky-500 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CEFR Scale
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hours")}
            className={`tactile-btn py-2 px-3.5 rounded-xl text-xs font-semibold transition-all text-center ${
              activeTab === "hours"
                ? "bg-sky-500 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live Speech
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("flexibility")}
            className={`tactile-btn py-2 px-3.5 rounded-xl text-xs font-semibold transition-all text-center ${
              activeTab === "flexibility"
                ? "bg-sky-500 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            1-Click Shift
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("attention")}
            className={`tactile-btn py-2 px-3.5 rounded-xl text-xs font-semibold transition-all text-center ${
              activeTab === "attention"
                ? "bg-sky-500 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Private Room
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="py-8 relative z-10 min-h-[300px] flex flex-col justify-center">

        {/* MODE 1: CEFR FLUENCY PROGRESSION BENCHMARK */}
        {activeTab === "fluency" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  <NumberTicker value={98.4} decimalPlaces={1} suffix="%" />
                </span>
                <p className="font-body text-xs text-slate-400 mt-1">
                  First-attempt fluency & certification completion benchmark
                </p>
              </div>

              {/* CEFR Level Selector Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
                {cefrMilestones.map((m, idx) => (
                  <button
                    key={m.level}
                    type="button"
                    onClick={() => setSelectedCefr(idx)}
                    className={`tactile-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedCefr === idx
                        ? "bg-white text-text-primary shadow-xs scale-105"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.level}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Level Card */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full font-mono text-xs font-bold">
                    CEFR {milestone.level} — {milestone.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Expected: {milestone.timeline}
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Target: {milestone.examTarget}
                </span>
              </div>

              <p className="font-body text-sm sm:text-base text-slate-200 leading-relaxed">
                {milestone.speakingAbility}
              </p>

              {/* Sample Speech Quote Box */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-xs sm:text-sm text-sky-300 italic">
                {milestone.sampleDialogue}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: LIVE SPEECH AUDIO WAVEFORM SIMULATOR */}
        {activeTab === "hours" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  <NumberTicker value={1250} suffix="+" />
                </span>
                <p className="font-body text-xs text-slate-400 mt-1">
                  Live 1-on-1 spoken hours delivered via Google Meet
                </p>
              </div>

              {/* Audio Play/Pause Simulated Button */}
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`tactile-btn px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                  isPlayingAudio
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white text-text-primary hover:bg-slate-200"
                }`}
              >
                <HugeIcon name={isPlayingAudio ? "pause" : "sparkles"} size={16} />
                <span>{isPlayingAudio ? "Pause Audio Stream" : "Listen to Tutor Feedback"}</span>
              </button>
            </div>

            {/* Oscillating Soundwave Visualizer */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Google Meet Audio Stream (WAT)</span>
                <span>{isPlayingAudio ? "Playing Pronunciation Drill" : "Click 'Listen' to test soundwave"}</span>
              </div>

              <div className="h-20 flex items-center justify-center gap-1.5 sm:gap-2 px-4">
                {waveHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 sm:w-2 bg-gradient-to-t from-sky-500 to-emerald-400 rounded-full transition-all duration-100 ease-out"
                    style={{ height: `${isPlayingAudio ? h : 16}px` }}
                  />
                ))}
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-slate-300 font-body flex items-start gap-2.5">
                <HugeIcon name="comment" size={16} className="text-sky-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Divine (Tutor):</strong> &quot;Notice the rolling R sound in <em>ferrocarril</em>. Place your tongue flat against the alveolar ridge and exhale with pressure. Let&apos;s try together.&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: 1-CLICK SCHEDULE SHIFTER */}
        {activeTab === "flexibility" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  <NumberTicker value={24} suffix="h" />
                </span>
                <p className="font-body text-xs text-slate-400 mt-1">
                  Free rescheduling window with zero penalties or lock-ins
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRescheduleState(rescheduleState === "current" ? "shifted" : "current")}
                className="tactile-btn px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs"
              >
                <HugeIcon name="calendar" size={16} />
                <span>Simulate Slot Shift</span>
              </button>
            </div>

            {/* Interactive Scheduling Card */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block">
                  Current Reserved Slot
                </span>
                <div className={`p-4 rounded-xl border transition-all ${
                  rescheduleState === "current"
                    ? "bg-white/10 border-sky-400 text-white shadow-md"
                    : "bg-white/5 border-white/10 text-slate-400 opacity-60"
                }`}>
                  <p className="font-heading font-bold text-base">Thursday, 03:00 PM WAT</p>
                  <p className="text-xs mt-1">1-on-1 Spanish Conversation • Room Active</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block">
                  Shifted Slot (Zero Penalty)
                </span>
                <div className={`p-4 rounded-xl border transition-all ${
                  rescheduleState === "shifted"
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-md"
                    : "bg-white/5 border-white/10 text-slate-400 opacity-60"
                }`}>
                  <p className="font-heading font-bold text-base text-emerald-300">Friday, 06:00 PM WAT</p>
                  <p className="text-xs mt-1">Google Meet Room Link Re-issued Instantly</p>
                </div>
              </div>
            </div>

            <p className="font-mono text-xs text-slate-400 text-center">
              ⚡ You can reschedule directly on your dashboard up to 24 hours prior to class in under 5 seconds.
            </p>
          </div>
        )}

        {/* MODE 4: 1-ON-1 ATTENTION SIMULATOR */}
        {activeTab === "attention" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  1-on-1
                </span>
                <p className="font-body text-xs text-slate-400 mt-1">
                  100% Dedicated attention — no crowded breakout groups
                </p>
              </div>

              <Link
                href="/signup?redirect=/dashboard/book"
                className="tactile-btn px-5 py-2.5 bg-white text-text-primary hover:bg-slate-200 rounded-full text-xs font-semibold inline-flex items-center gap-2"
              >
                <span>Book Private Trial</span>
                <HugeIcon name="arrow-right" size={14} />
              </Link>
            </div>

            {/* Dual Video Room Dialogue Box */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Tutor Tile */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-heading font-bold text-xs">
                      D
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs text-white">Divine (Instructor)</p>
                      <p className="text-[10px] text-emerald-400">● Speaking</p>
                    </div>
                  </div>
                  <HugeIcon name="video" size={16} className="text-slate-400" />
                </div>
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-lg text-xs text-sky-200">
                  &quot;Great sentence structure! Just remember: with irregular verbs like <em>saber</em>, we say <em>yo sé</em>, not <em>yo sabo</em>.&quot;
                </div>
              </div>

              {/* Student Tile */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-heading font-bold text-xs">
                      S
                    </div>
                    <div>
                      <p className="font-heading font-bold text-xs text-white">Sofia (Student)</p>
                      <p className="text-[10px] text-slate-400">Listening & Taking Notes</p>
                    </div>
                  </div>
                  <HugeIcon name="video" size={16} className="text-slate-400" />
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">
                  &quot;¡Ah, entiendo perfectamente! Ahora recuerdo: <em>yo sé la respuesta</em>.&quot;
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Bottom Static Metric Pillars Dock */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10 relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab("hours")}
          className={`text-left p-3.5 rounded-2xl transition-all ${
            activeTab === "hours" ? "bg-white/10 border border-sky-400/50" : "hover:bg-white/5"
          }`}
        >
          <span className="font-heading text-2xl font-bold text-white block">1,250+</span>
          <span className="font-body text-xs text-slate-400 mt-0.5 block">Live Hours Taught</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fluency")}
          className={`text-left p-3.5 rounded-2xl transition-all ${
            activeTab === "fluency" ? "bg-white/10 border border-sky-400/50" : "hover:bg-white/5"
          }`}
        >
          <span className="font-heading text-2xl font-bold text-white block">98.4%</span>
          <span className="font-body text-xs text-slate-400 mt-0.5 block">Fluency Pass Rate</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("flexibility")}
          className={`text-left p-3.5 rounded-2xl transition-all ${
            activeTab === "flexibility" ? "bg-white/10 border border-sky-400/50" : "hover:bg-white/5"
          }`}
        >
          <span className="font-heading text-2xl font-bold text-white block">24h</span>
          <span className="font-body text-xs text-slate-400 mt-0.5 block">Free Rescheduling</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("attention")}
          className={`text-left p-3.5 rounded-2xl transition-all ${
            activeTab === "attention" ? "bg-white/10 border border-sky-400/50" : "hover:bg-white/5"
          }`}
        >
          <span className="font-heading text-2xl font-bold text-white block">1-on-1</span>
          <span className="font-body text-xs text-slate-400 mt-0.5 block">Dedicated Tutor</span>
        </button>
      </div>

    </div>
  );
}
