"use client";

import React, { useEffect, useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpotlightCard from "@/components/ui/SpotlightCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const tracks = [
  {
    id: "es",
    code: "01",
    language: "Spanish Conversational & DELE",
    level: "A1 – C1 Focus",
    intensity: "30 or 60 min",
    headline: "Rolling R sounds, subjunctive verbs & workplace fluency",
    detail: "From basic conversational confidence to advanced DELE exam certifications. Practice live speaking dialogues with real-time feedback.",
    topics: ["Subjunctive Mood", "DELE Oral Mock", "Castilian vs LatAm Idioms"],
    image: "/images/tracks/spanish.jpg",
    accent: "Spanish",
    colSpan: "lg:col-span-7",
    featured: true,
    tag: "Most Popular",
  },
  {
    id: "fr",
    code: "02",
    language: "French TEF & Express Entry",
    level: "B1 – B2 Target",
    intensity: "60 or 90 min",
    headline: "Immigration interview simulations & past tense mastery",
    detail: "Targeted CLB 7+ Canadian immigration benchmarks with intensive speaking drills and listening comprehension.",
    topics: ["TEF Section A & B", "Subjonctif & Passé Composé", "Express Entry Oral"],
    image: "/images/tracks/french.jpg",
    accent: "French",
    colSpan: "lg:col-span-5",
    featured: false,
    tag: "Express Entry",
  },
  {
    id: "en",
    code: "03",
    language: "Executive Business English",
    level: "All Levels",
    intensity: "60 min",
    headline: "Global boardroom presentations, accent clarity & idioms",
    detail: "Tailored for international founders, engineers, and corporate managers delivering high-stakes pitches and reports.",
    topics: ["Executive Presentations", "Accent Neutralization", "Boardroom Debates"],
    image: "/images/tracks/english.jpg",
    accent: "English",
    colSpan: "lg:col-span-5",
    featured: false,
    tag: "Executive Track",
  },
  {
    id: "de",
    code: "04",
    language: "German Goethe-Zertifikat Prep",
    level: "A1 – B2 Focus",
    intensity: "60 or 90 min",
    headline: "Grammar breakdown, case systems & confident speaking",
    detail: "Master the German case system (Nominativ, Akkusativ, Dativ, Genitiv) with structural drills and mock oral exams.",
    topics: ["Case Systems & Endings", "Sprechen Prüfung", "Sentence Structure (TeKaMoLo)"],
    image: "/images/tracks/german.jpg",
    accent: "German",
    colSpan: "lg:col-span-7",
    featured: true,
    tag: "Goethe Prep",
  },
];

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

  // GSAP 60fps ScrollTrigger Hardware Accelerated Stagger
  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".pillar-bento-card", {
        opacity: 0,
        y: 35,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".pillar-bento-grid",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      gsap.from(".bento-track-card", {
        opacity: 0,
        y: 40,
        duration: 0.75,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bento-track-grid",
          start: "top 82%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-wider mb-3">
              <HugeIcon name="sparkles" size={13} />
              <span>Pedagogy That Works</span>
            </div>
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

        {/* Header for Language Tracks Bento */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border-light flex-wrap gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-blue">
              Live Curriculum Catalog
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Active Language Tracks
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

        {/* Sophisticated Language Tracks Bento Grid */}
        <div className="bento-track-grid grid grid-cols-1 lg:grid-cols-12 gap-6">
          {tracks.map((t) => (
            <SpotlightCard
              key={t.id}
              spotlightColor="rgba(255, 255, 255, 0.12)"
              className={`bento-track-card ${t.colSpan} tactile-card-dark rounded-[32px] overflow-hidden flex flex-col justify-between relative group min-h-[380px] p-7 sm:p-9 border border-white/10 hover:border-accent-blue/40 shadow-xl transition-all duration-300`}
            >
              {/* Background Photographic Atmosphere */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Image
                  src={t.image}
                  alt={t.language}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out opacity-25 group-hover:opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/90 to-transparent" />
                <div className="absolute inset-0 bg-radial at-top from-transparent to-[#0b0e14]/80" />
              </div>

              {/* Card Header Metadata */}
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent-blue bg-accent-blue/15 px-2.5 py-1 rounded-full border border-accent-blue/30">
                      ({t.code}) {t.accent.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                      {t.level}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t.tag}
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-2 group-hover:text-sky-300 transition-colors">
                  {t.language}
                </h3>
                <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-xl mb-4">
                  {t.detail}
                </p>

                {/* Interactive Focus Topics */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {t.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 group-hover:border-accent-blue/30 group-hover:text-white transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions & Meta */}
              <div className="relative z-10 pt-6 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <HugeIcon name="calendar" size={14} className="text-accent-blue" />
                    <span>{t.intensity}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <HugeIcon name="video" size={14} className="text-emerald-400" />
                    <span>Google Meet 1-on-1</span>
                  </div>
                </div>

                <Link
                  href="/signup?redirect=/dashboard/book"
                  className={`tactile-btn px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 ${
                    t.featured ? "btn-tactile-primary" : "btn-tactile-secondary"
                  }`}
                >
                  <span>Book {t.accent} Track</span>
                  <HugeIcon name="arrow-right" size={14} />
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>

      </div>
    </section>
  );
}
