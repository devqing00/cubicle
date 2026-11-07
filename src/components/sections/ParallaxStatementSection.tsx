"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Student Testimonials with large quotes, authentic credentials & metric outcomes
const testimonials = [
  {
    id: "sofia",
    studentName: "Sofia Morales",
    studentRole: "VP of Product, FinTech",
    location: "Madrid Relocation",
    languageTrack: "Spanish Fluency & DELE",
    avatar: "/images/tracks/spanish.jpg",
    quote:
      "“In 8 weeks with Divine, I went from frozen textbook grammar to leading our entire Barcelona product summit in Spanish. Zero stumbling, zero English switches.”",
    outcomeBadge: "Madrid B2 Certified",
    metric1: "98.4%",
    metric1Label: "Fluency Benchmark",
    metric2: "0ms",
    metric2Label: "Translation Delay",
    tutorNote: "Coached by Divine Ailemen",
  },
  {
    id: "marcus",
    studentName: "Marcus Vance",
    studentRole: "Lead Cloud Architect",
    location: "Toronto Migration",
    languageTrack: "French TEF Canada",
    avatar: "/images/tracks/french.jpg",
    quote:
      "“Divine drilled Section B counter-argument tactics until French responses became pure instinct. Scored CLB 9 on my first try and cleared Canadian PR.”",
    outcomeBadge: "TEF Oral: CLB 9 Passing",
    metric1: "386 / 450",
    metric1Label: "IRCC Verified Score",
    metric2: "1st Attempt",
    metric2Label: "Exam Milestone",
    tutorNote: "Coached by Divine Ailemen",
  },
  {
    id: "elena",
    studentName: "Elena Rostova",
    studentRole: "Co-Founder & CTO",
    location: "Series B AI Enterprise",
    languageTrack: "Executive Business English",
    avatar: "/images/tracks/english.jpg",
    quote:
      "“Divine purged every hedging word from my diction. In our US investor meetings, partners specifically praised how authoritative and crisp my delivery was.”",
    outcomeBadge: "US Pitch Deck Approved",
    metric1: "$18M Closed",
    metric1Label: "Series B Round",
    metric2: "99.2%",
    metric2Label: "Executive Presence",
    tutorNote: "Coached by Divine Ailemen",
  },
];

export default function ParallaxStatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const typographyContainerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const track3Ref = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  // Dynamic Testimonial Carousel Cycle
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4600);
    return () => clearInterval(timer);
  }, []);

  const activeTestimonial = testimonials[activeIndex];

  // Continuous 60fps Marquee Drift (Moves even without scrolling) + Scroll-Direction Aware Velocity Boost
  useEffect(() => {
    if (typeof window === "undefined") return;

    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let lastScrollY = window.scrollY;

    const onTick = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Natural continuous drift even when idle + scroll-direction aware velocity multiplication
      pos1 -= 0.65 + scrollDelta * 0.4;
      pos2 += 0.65 - scrollDelta * 0.4;
      pos3 -= 0.55 + scrollDelta * 0.35;

      // Apply transforms seamlessly across all 3 kinetic tracks
      if (track1Ref.current) {
        track1Ref.current.style.transform = `translate3d(${pos1 % 1600}px, 0, 0)`;
      }
      if (track2Ref.current) {
        track2Ref.current.style.transform = `translate3d(${pos2 % 1600}px, 0, 0)`;
      }
      if (track3Ref.current) {
        track3Ref.current.style.transform = `translate3d(${pos3 % 1600}px, 0, 0)`;
      }
    };

    gsap.ticker.add(onTick);

    // Parallax card rise on scroll
    let ctx: gsap.Context | null = null;
    if (sectionRef.current) {
      ctx = gsap.context(() => {
        if (foregroundRef.current) {
          gsap.to(foregroundRef.current, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }, sectionRef);
    }

    return () => {
      gsap.ticker.remove(onTick);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[700px] sm:h-[780px] overflow-hidden flex items-center justify-center bg-[#05070d] select-none my-16"
      style={{
        clipPath: "polygon(0 3.5vw, 100% 0, 100% calc(100% - 3.5vw), 0 100%)",
      }}
    >
      {/* Background (Atmospheric Depth Layer) */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none z-0"
      >
        <Image
          src="/images/hero_bg_land.png"
          alt="Atmospheric Background"
          fill
          className="object-cover opacity-10 filter grayscale contrast-150 brightness-50"
        />
        <div className="absolute inset-0 bg-radial at-center from-transparent via-[#05070d]/80 to-[#05070d]" />
      </div>

      {/* Multi-Track Kinetic Typography: Slanted to -2° matching the section's edge slant, moving continuously */}
      <div
        ref={typographyContainerRef}
        className="absolute inset-0 flex flex-col justify-around py-14 pointer-events-none z-10 overflow-hidden"
        style={{
          transform: "rotate(-2deg) scale(1.15)",
        }}
      >
        {/* Track 1: Moves Left continuously (Even without scrolling) */}
        <div ref={track1Ref} className="flex gap-8 whitespace-nowrap will-change-transform">
          <span className="text-5xl sm:text-7xl md:text-[110px] font-black text-white/[0.035] uppercase tracking-tighter font-heading">
            REAL 1-ON-1 CONVERSATION • DIRECT TUTOR IMMERSION • NO ROBOT DRILLS • MADRID DELE C1 •
          </span>
          <span className="text-5xl sm:text-7xl md:text-[110px] font-black text-white/[0.035] uppercase tracking-tighter font-heading">
            REAL 1-ON-1 CONVERSATION • DIRECT TUTOR IMMERSION • NO ROBOT DRILLS • MADRID DELE C1 •
          </span>
        </div>

        {/* Track 2: Moves Right continuously */}
        <div ref={track2Ref} className="flex gap-8 whitespace-nowrap will-change-transform -ml-[400px]">
          <span className="text-5xl sm:text-7xl md:text-[110px] font-black text-sky-400/[0.03] uppercase tracking-tighter font-heading">
            INSTANT ACCENT CLARITY • SUBJUNCTIVE REFLEX • FLUENCY IN WEEKS • FRENCH TEF CANADA •
          </span>
          <span className="text-5xl sm:text-7xl md:text-[110px] font-black text-sky-400/[0.03] uppercase tracking-tighter font-heading">
            INSTANT ACCENT CLARITY • SUBJUNCTIVE REFLEX • FLUENCY IN WEEKS • FRENCH TEF CANADA •
          </span>
        </div>

        {/* Track 3: Moves Left continuously */}
        <div ref={track3Ref} className="flex gap-8 whitespace-nowrap will-change-transform">
          <span className="text-5xl sm:text-7xl md:text-[110px] font-black text-white/[0.035] uppercase tracking-tighter font-heading">
            EXECUTIVE BOARDROOM PRECISION • NATIVE IDIOMS • CRISP ASSERTIONS • NO HEDGING •
          </span>
          <span className="text-5xl sm:text-7xl md:text-[110px] font-black text-white/[0.035] uppercase tracking-tighter font-heading">
            EXECUTIVE BOARDROOM PRECISION • NATIVE IDIOMS • CRISP ASSERTIONS • NO HEDGING •
          </span>
        </div>
      </div>

      {/* Foreground Layer (Testimonial Bento Card with Metallic Dark Silver Glow & Zero Dividers) */}
      <div
        ref={foregroundRef}
        className="relative z-20 will-change-transform max-w-[92vw]"
      >
        {/* Metallic Dark Silver Conic Glow Wrapper */}
        <div className="glow-border-wrapper">
          <div className="glow-border-inner w-[350px] sm:w-[480px] md:w-[520px] p-7 sm:p-9 text-white relative">
            
            {/* Ambient Watermark Quote Mark in Background */}
            <span className="font-serif text-8xl sm:text-9xl text-white/[0.04] absolute top-2 left-4 pointer-events-none select-none leading-none -z-0">
              “
            </span>

            {/* Testimonial Header: Student Identity & Track Tag (No dividers) */}
            <div className="relative z-10 flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden relative shrink-0 shadow-md">
                  <Image
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.studentName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-white leading-tight">
                    {activeTestimonial.studentName}
                  </h4>
                  <p className="font-body text-[11px] text-slate-400 mt-0.5">
                    {activeTestimonial.studentRole} • {activeTestimonial.location}
                  </p>
                </div>
              </div>

              <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full shrink-0 shadow-2xs">
                {activeTestimonial.outcomeBadge}
              </span>
            </div>

            {/* Large Testimonial Quote (No dividers, high-impact typography) */}
            <div className="relative z-10 mb-6">
              <p className="font-heading text-base sm:text-lg md:text-[21px] font-medium text-slate-100 leading-snug tracking-tight">
                {activeTestimonial.quote}
              </p>
            </div>

            {/* Metric Outcomes Bento Duo (No line dividers, soft spatial tiles) */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 bg-white/[0.04] rounded-2xl">
                <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  {activeTestimonial.metric1Label}
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-emerald-400 mt-0.5 block">
                  {activeTestimonial.metric1}
                </span>
              </div>
              <div className="p-3.5 bg-white/[0.04] rounded-2xl">
                <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  {activeTestimonial.metric2Label}
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-sky-400 mt-0.5 block">
                  {activeTestimonial.metric2}
                </span>
              </div>
            </div>

            {/* Footer: Divine Ailemen Attribution & Tactile Booking Button (No dividers, no progress bar) */}
            <div className="relative z-10 flex items-center justify-between gap-4 pt-1">
              <div>
                <p className="font-mono text-xs font-semibold text-slate-300">
                  {activeTestimonial.tutorNote}
                </p>
                <p className="font-body text-[10px] text-slate-400 mt-0.5">
                  Verified 1-on-1 Student Outcome
                </p>
              </div>

              <Link
                href="/signup?redirect=/dashboard/book"
                className="tactile-btn btn-tactile-primary px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shrink-0 shadow-md"
              >
                <span>Book Your Trial</span>
                <HugeIcon name="arrow-right" size={13} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
