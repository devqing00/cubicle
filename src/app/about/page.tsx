"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[1000px] mx-auto w-full">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider border border-accent-blue/20 mb-4 inline-block">
              Our Story & Mission
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              A softer, smarter way to <span className="italic text-accent-blue">master languages.</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              We built Cubicle to eliminate the friction of robotic language apps and passive video courses. Real fluency comes from authentic, 1-on-1 human conversations.
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col justify-between">
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

            <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col justify-between">
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

            <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col justify-between">
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

          {/* Method Deep Dive */}
          <div className="bg-gradient-to-b from-[#0a1936] via-[#051026] to-[#030918] p-8 sm:p-12 rounded-[28px] text-white mb-20 relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <span className="px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
                The Cubicle Methodology
              </span>
              <h2 className="font-heading text-white text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                Why 60 Minutes of Conversation Trumps Months of App Gamification
              </h2>
              <p className="font-body text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Language learning apps train you to recognize multiple-choice options, not speak in high-pressure situations. Cubicle puts you in real-time, interactive 60-minute dialogue sessions where you build real neural pathways for rapid recall.
              </p>
              <Link
                href="/signup?redirect=/dashboard/book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-text-primary rounded-full font-body text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                <span>Claim Your Free Trial</span>
                <HugeIcon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>

          {/* Instructor Vetting Standards */}
          <div className="bg-white p-8 sm:p-12 rounded-[28px] border border-border-light shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-3">Vetted Lead Instructors</h2>
              <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Every instructor on Cubicle undergoes background checks, language teaching certifications, and live trial lesson audits before working with students.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-surface-muted border border-border-light rounded-full text-xs font-semibold text-text-primary">
                  ✓ Certified Native Speakers
                </span>
                <span className="px-3 py-1 bg-surface-muted border border-border-light rounded-full text-xs font-semibold text-text-primary">
                  ✓ 100% Google Meet Integrated
                </span>
                <span className="px-3 py-1 bg-surface-muted border border-border-light rounded-full text-xs font-semibold text-text-primary">
                  ✓ Personalized Lesson Plans
                </span>
              </div>
            </div>
            <Link
              href="/signup?redirect=/dashboard/book"
              className="px-8 py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors shrink-0"
            >
              Start Learning Now
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
