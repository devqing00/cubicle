"use client";

import React, { useState } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";

type PolicyScenario = "early" | "late" | "noshow";

interface ScenarioData {
  id: PolicyScenario;
  tabLabel: string;
  badge: string;
  badgeStyle: string;
  title: string;
  verdict: string;
  explanation: string;
  actionText: string;
  actionOutcome: string;
  actionType: "shift" | "whatsapp" | "policy";
}

const scenarios: Record<PolicyScenario, ScenarioData> = {
  early: {
    id: "early",
    tabLabel: "> 24 Hours Notice",
    badge: "100% Free Rescheduling or Credit",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Standard Cancellation / Reschedule Window",
    verdict: "Zero penalty. 1-click slot change in your dashboard.",
    explanation:
      "Life happens. If you adjust your session at least 24 hours prior to class, your slot is instantly released back to the calendar. You can book any new slot immediately or receive a full credit balance.",
    actionText: "Simulate 1-Click Reschedule",
    actionOutcome: "✅ Slot shifted to Friday 05:00 PM WAT • Google Meet link updated automatically!",
    actionType: "shift",
  },
  late: {
    id: "late",
    tabLabel: "< 24 Hours Notice",
    badge: "Tutor Discretion & WhatsApp Support",
    badgeStyle: "bg-amber-50 text-amber-800 border-amber-200",
    title: "Inside the 24-Hour Preparation Window",
    verdict: "Automated cancellations closed. Direct instructor chat active.",
    explanation:
      "Because your instructor has already reserved this exclusive hour and personalized lesson materials, cancellations inside 24 hours are non-refundable. For unforeseen medical or work emergencies, contact your instructor directly on WhatsApp.",
    actionText: "Simulate WhatsApp Emergency Chat",
    actionOutcome: "💬 WhatsApp prompt opened: 'Hi Divine, an unexpected meeting came up. Can we review tomorrow's options?'",
    actionType: "whatsapp",
  },
  noshow: {
    id: "noshow",
    tabLabel: "Unattended Session",
    badge: "15-Minute Grace Period",
    badgeStyle: "bg-surface-muted text-text-subtle border-border-light",
    title: "No-Show & Attendance Policy",
    verdict: "Slot held for 15 minutes before session closure.",
    explanation:
      "Your tutor stays in the private Google Meet room for 15 minutes. To respect instructor preparation and held time, unattended sessions cannot be refunded or rescheduled.",
    actionText: "Review Punctuality Guidelines",
    actionOutcome: "📋 Reminder: Google Meet room links are emailed 30 minutes and 5 minutes prior to class.",
    actionType: "policy",
  },
};

export default function PolicySection() {
  const [activeScenario, setActiveScenario] = useState<PolicyScenario>("early");
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  const scenario = scenarios[activeScenario];

  return (
    <section id="cancellation-policy" className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-accent-blue font-bold block mb-1">
              Transparent Standards
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.05] tracking-tight">
              Honest policies. <br className="hidden sm:inline" />
              <span className="italic text-accent-blue">Built on trust.</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-text-secondary max-w-md leading-relaxed font-normal">
            We value your time and our tutors&apos; schedules. Test any situation in our interactive policy simulator below.
          </p>
        </div>

        {/* Interactive Policy Simulator Box */}
        <div className="bg-white border border-border-light rounded-[32px] p-6 sm:p-10 shadow-sm mb-12 space-y-8">
          
          {/* Scenario Tab Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {(["early", "late", "noshow"] as PolicyScenario[]).map((key) => {
              const item = scenarios[key];
              const isActive = activeScenario === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveScenario(key);
                    setSimulationStatus(null);
                  }}
                  className={`tactile-btn px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-text-primary text-white border-text-primary shadow-xs scale-[1.02]"
                      : "bg-surface-near-white text-text-secondary border-border-light hover:text-text-primary hover:border-border-subtle"
                  }`}
                >
                  {item.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Active Scenario Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-near-white border border-border-light space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className={`inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${scenario.badgeStyle}`}>
                  {scenario.badge}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mt-2">
                  {scenario.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSimulationStatus(scenario.actionOutcome)}
                className="tactile-btn px-4 py-2 bg-white text-text-primary border border-border-light hover:border-accent-blue/40 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xs self-start sm:self-auto"
              >
                <HugeIcon name="sparkles" size={14} className="text-accent-blue" />
                <span>{scenario.actionText}</span>
              </button>
            </div>

            <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
              {scenario.explanation}
            </p>

            {/* Simulation Feedback Alert */}
            {simulationStatus && (
              <div className="p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-xl text-xs sm:text-sm font-mono text-accent-blue flex items-center gap-3 animate-fadeIn">
                <HugeIcon name="check" size={16} className="shrink-0" />
                <span>{simulationStatus}</span>
              </div>
            )}
          </div>

          {/* 3 Core Rules Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-white border border-border-light space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h4 className="font-heading font-bold text-sm text-text-primary">24h+ Advance Window</h4>
              <p className="font-body text-xs text-text-secondary leading-relaxed">
                Zero rescheduling penalties. Unlimited self-service date/time changes in your student portal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-border-light space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                !
              </div>
              <h4 className="font-heading font-bold text-sm text-text-primary">Under 24h Window</h4>
              <p className="font-body text-xs text-text-secondary leading-relaxed">
                Instructor preparation is held. Direct WhatsApp messaging available for genuine emergencies.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-border-light space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-muted text-text-subtle flex items-center justify-center font-bold text-xs">
                ⏱
              </div>
              <h4 className="font-heading font-bold text-sm text-text-primary">15-Min Grace Period</h4>
              <p className="font-body text-xs text-text-secondary leading-relaxed">
                Your instructor waits 15 minutes before closing the room. Unattended slots cannot be credited.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between text-xs text-text-secondary border-t border-border-light pt-6 flex-wrap gap-4">
          <p className="font-body">
            Need special accommodations or custom corporate scheduling?
          </p>
          <Link
            href="/contact"
            className="swiss-link font-semibold hover:text-accent-blue flex items-center gap-1.5"
          >
            <span>Read full cancellation & refund terms</span>
            <HugeIcon name="arrow-right" size={12} />
          </Link>
        </div>

      </div>
    </section>
  );
}
