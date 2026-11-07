"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  useSmoothScroll();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-hero", {
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });

      gsap.from(".about-bento-card", {
        opacity: 0,
        y: 35,
        duration: 0.7,
        stagger: 0.1,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: ".about-bento-grid",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      gsap.from(".about-method-card", {
        opacity: 0,
        scale: 0.97,
        y: 30,
        duration: 0.8,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: ".about-method-card",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[1050px] mx-auto w-full">
          
          {/* Header */}
          <div className="about-hero text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              A softer, smarter way to <span className="italic text-accent-blue">master languages.</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              We built Cubicle to eliminate the friction of robotic language apps and passive video courses. Real fluency comes from authentic, 1-on-1 human conversations.
            </p>
          </div>

          {/* Key Pillars Bento Grid */}
          <div className="about-bento-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="about-bento-card tactile-card swiss-lift p-8 rounded-[32px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-accent-blue mb-6">
                <HugeIcon name="sparkles" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">1-on-1 Dedicated Tutors</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Practice directly with experienced instructors who adapt every lesson to your personal pace, accent, and career goals.
                </p>
              </div>
            </div>

            <div className="about-bento-card tactile-card swiss-lift p-8 rounded-[32px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-accent-blue mb-6">
                <HugeIcon name="calendar" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Instant Scheduling</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  No back-and-forth emails. Pick a time slot on your terms and receive your instant Google Meet link in seconds.
                </p>
              </div>
            </div>

            <div className="about-bento-card tactile-card swiss-lift p-8 rounded-[32px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-accent-blue mb-6">
                <HugeIcon name="comment" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">WhatsApp Feedback Loop</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Receive post-lesson notes, targeted vocabulary lists, and homework reminders directly on WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Method Deep Dive Bento Card */}
          <div className="about-method-card tactile-section-container-dark bg-gradient-to-b from-[#0a1936] via-[#051026] to-[#030918] p-8 sm:p-14 rounded-[36px] text-white mb-20 relative overflow-hidden border border-blue-900/40">
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-accent-blue/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="max-w-2xl relative z-10">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-blue font-bold mb-3 block">
                The Science of Conversational Fluency
              </span>
              <h2 className="font-heading text-white text-3xl sm:text-4xl font-bold mb-5 leading-tight">
                Why 60 Minutes of Live Dialogue Trumps Months of App Gamification
              </h2>
              <p className="font-body text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Language learning apps train you to recognize multiple-choice options, not speak in high-pressure situations. Cubicle puts you in real-time, interactive 60-minute dialogue sessions where you build real neural pathways for rapid recall.
              </p>
              <Link
                href="/signup?redirect=/dashboard/book"
                className="tactile-btn btn-tactile-secondary inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-body text-xs font-semibold"
              >
                <span>Claim Your Free Trial</span>
                <HugeIcon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>

          {/* Instructor Vetting Standards Bento */}
          <div className="tactile-card swiss-lift p-8 sm:p-12 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-3">Vetted Lead Instructors</h2>
              <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Every instructor on Cubicle undergoes background checks, language teaching certifications, and live trial lesson audits before working with students.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs font-semibold text-text-primary bg-surface-muted px-3 py-1.5 rounded-full border border-border-light">
                  ✓ Certified Native Speakers
                </span>
                <span className="text-xs font-semibold text-text-primary bg-surface-muted px-3 py-1.5 rounded-full border border-border-light">
                  ✓ 100% Google Meet Integrated
                </span>
                <span className="text-xs font-semibold text-text-primary bg-surface-muted px-3 py-1.5 rounded-full border border-border-light">
                  ✓ Personalized Lesson Plans
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
