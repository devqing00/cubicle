"use client";

import React, { useEffect, useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpotlightCard from "@/components/ui/SpotlightCard";
import LanguageStudio from "@/components/sections/LanguageStudio";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const pillars = [
  {
    icon: "comment" as const,
    title: "Real conversation first",
    description:
      "Before any slot is locked in, you have a direct WhatsApp introduction with your instructor. We align on your speaking goals upfront.",
    badge: "Direct WhatsApp",
    colSpan: "md:col-span-6 lg:col-span-6",
  },
  {
    icon: "calendar" as const,
    title: "Instant live scheduling",
    description:
      "Pick from verified available slots on our live calendar. Your Google Meet room link is provisioned immediately upon booking.",
    badge: "Instant Meet Link",
    colSpan: "md:col-span-6 lg:col-span-6",
  },
  {
    icon: "shield" as const,
    title: "Transparent 24h flexibility",
    description:
      "Reschedule freely up to 24 hours before your session. No hidden fees, no lock-in contracts, and no complicated recurring traps.",
    badge: "0 Lock-In",
    colSpan: "md:col-span-6 lg:col-span-6",
  },
  {
    icon: "brain" as const,
    title: "Personalized lesson records",
    description:
      "Every session logs your speaking notes, new vocabulary, and review points directly into your student portal archive.",
    badge: "Archived Notes",
    colSpan: "md:col-span-6 lg:col-span-6",
  },
];

export default function DifferentiatorSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.05] tracking-tight">
              Learning designed around <span className="italic text-accent-blue">your life.</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-text-secondary max-w-md leading-relaxed font-normal">
            No pre-recorded lectures. You show up to real 1-on-1 Google Meet dialogues with an expert instructor who knows your exact pace.
          </p>
        </div>

        {/* Sophisticated Pillars Bento Grid */}
        <div className="pillar-bento-grid grid gap-6 grid-cols-1 md:grid-cols-12 mb-20">
          {pillars.map((item, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(2, 132, 199, 0.08)"
              className={`pillar-bento-card ${item.colSpan} tactile-card rounded-[28px] p-7 sm:p-8 flex flex-col justify-between group border border-border-light hover:border-accent-blue/30 shadow-xs hover:shadow-md transition-all duration-300`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-surface-muted border border-border-light flex items-center justify-center text-text-primary group-hover:border-accent-blue/40 group-hover:text-accent-blue group-hover:scale-105 transition-all">
                    <HugeIcon name={item.icon} size={22} />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-2.5 py-1 rounded-full border border-accent-blue/20">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Header for Language Tracks Studio */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border-light flex-wrap gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-blue">
              Interactive Curriculum Studio
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Active Language Tracks & Pronunciation Lab
            </h3>
          </div>
          <Link
            href="/signup?redirect=/dashboard/book"
            className="swiss-link text-xs font-semibold hover:text-accent-blue flex items-center gap-1.5"
          >
            <span>Explore All Available Tracks</span>
            <HugeIcon name="arrow-up-right" size={14} />
          </Link>
        </div>

        {/* Live Interactive Language Studio */}
        <LanguageStudio />

      </div>
    </section>
  );
}
