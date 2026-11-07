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

export default function HowItWorksPage() {
  useSmoothScroll();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".how-bento-hero", {
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });

      gsap.from(".how-bento-card", {
        opacity: 0,
        y: 35,
        duration: 0.7,
        stagger: 0.1,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: ".how-bento-grid",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      gsap.from(".how-hardware-bento", {
        opacity: 0,
        y: 30,
        duration: 0.65,
        stagger: 0.08,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: ".how-hardware-grid",
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
        <div className="max-w-[1100px] mx-auto w-full">
          
          {/* Header */}
          <div className="how-bento-hero text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              How Cubicle brings language learning <span className="italic text-accent-blue">to life.</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              No complicated software downloads or rigid schedules. Four simple steps to start speaking fluently with dedicated instructors.
            </p>
          </div>

          {/* Sophisticated 4 Steps Bento Grid */}
          <div className="how-bento-grid grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
            
            {/* Step 1 - Large Bento Card */}
            <div className="how-bento-card md:col-span-7 tactile-card swiss-lift p-8 rounded-[32px] flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-3xl font-bold text-accent-blue">01</span>
                  <div className="w-11 h-11 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-text-primary group-hover:text-accent-blue group-hover:border-accent-blue/30 transition-colors">
                    <HugeIcon name="calendar" size={22} />
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">Pick Your Ideal Session & Slot</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  Select between a 60-minute Standard or 90-minute Intensive session. Browse real-time tutor availability calendars and pick a date that fits your life.
                </p>
              </div>

              <div className="p-4 bg-surface-near-white border border-border-light rounded-2xl flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-mono text-text-secondary">Verified West Africa Time (WAT)</span>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 bg-accent-blue text-white rounded text-[10px] font-bold">10:00 AM</span>
                  <span className="px-2 py-0.5 bg-surface-muted text-text-primary rounded text-[10px] font-medium">02:30 PM</span>
                  <span className="px-2 py-0.5 bg-surface-muted text-text-primary rounded text-[10px] font-medium">05:00 PM</span>
                </div>
              </div>
            </div>

            {/* Step 2 - Medium Bento Card */}
            <div className="how-bento-card md:col-span-5 tactile-card swiss-lift p-8 rounded-[32px] flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-3xl font-bold text-accent-blue">02</span>
                  <div className="w-11 h-11 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-text-primary group-hover:text-accent-blue group-hover:border-accent-blue/30 transition-colors">
                    <HugeIcon name="video" size={22} />
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">Instant Google Meet Delivery</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  Upon confirming your booking slot, a unique Google Meet video link is generated immediately and synced to your dashboard and calendar.
                </p>
              </div>

              <div className="p-3 bg-surface-near-white border border-border-light rounded-2xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-mono text-[11px] text-text-primary truncate">meet.google.com/cub-spn</span>
              </div>
            </div>

            {/* Step 3 - Medium Bento Card */}
            <div className="how-bento-card md:col-span-5 tactile-card swiss-lift p-8 rounded-[32px] flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-3xl font-bold text-accent-blue">03</span>
                  <div className="w-11 h-11 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-text-primary group-hover:text-accent-blue group-hover:border-accent-blue/30 transition-colors">
                    <HugeIcon name="brain" size={22} />
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">1-on-1 Live Conversation</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  Join your instructor in a private, distraction-free virtual classroom. Practice live speaking, accent correction, and real-world vocabulary exercises.
                </p>
              </div>

              <div className="p-3 bg-accent-blue/10 border border-accent-blue/20 rounded-2xl flex items-center justify-between text-xs text-accent-blue font-semibold">
                <span>Interactive Speaking Focus</span>
                <HugeIcon name="sparkles" size={16} />
              </div>
            </div>

            {/* Step 4 - Large Bento Card */}
            <div className="how-bento-card md:col-span-7 tactile-card swiss-lift p-8 rounded-[32px] flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-3xl font-bold text-accent-blue">04</span>
                  <div className="w-11 h-11 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-text-primary group-hover:text-accent-blue group-hover:border-accent-blue/30 transition-colors">
                    <HugeIcon name="comment" size={22} />
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">Post-Session WhatsApp Feedback</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  Receive personalized feedback notes, vocabulary lists, and optional practice assignments directly on WhatsApp right after your session.
                </p>
              </div>

              <div className="p-4 bg-surface-muted/60 border border-border-light rounded-2xl text-[11px] font-body text-text-secondary italic">
                &ldquo;Great progress on past tense verbs today! Keep practicing the 5 new vocabulary phrases before Thursday.&rdquo;
              </div>
            </div>

          </div>

          {/* Tech & Hardware Requirements Bento Trio */}
          <div className="tactile-card p-8 sm:p-12 rounded-[32px] border border-border-light mb-16">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">What You Need for Your First Lesson</h2>
            <div className="how-hardware-grid grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="how-hardware-bento p-6 bg-surface-near-white rounded-2xl border border-border-light swiss-lift">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-4">
                  <HugeIcon name="video" size={22} />
                </div>
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">Webcam & Microphone</h4>
                <p className="font-body text-xs text-text-secondary leading-relaxed">Any standard built-in laptop camera and microphone works great.</p>
              </div>
              <div className="how-hardware-bento p-6 bg-surface-near-white rounded-2xl border border-border-light swiss-lift">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-4">
                  <HugeIcon name="navigation" size={22} />
                </div>
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">Stable Internet</h4>
                <p className="font-body text-xs text-text-secondary leading-relaxed">Broadband connection capable of smooth HD Google Meet video calls.</p>
              </div>
              <div className="how-hardware-bento p-6 bg-surface-near-white rounded-2xl border border-border-light swiss-lift">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-4">
                  <HugeIcon name="comment" size={22} />
                </div>
                <h4 className="font-heading font-bold text-base text-text-primary mb-1">WhatsApp Account</h4>
                <p className="font-body text-xs text-text-secondary leading-relaxed">For instant booking reference verification and lesson notes.</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center tactile-card p-10 sm:p-14 rounded-[32px]">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">Ready to test it out?</h2>
            <p className="font-body text-sm text-text-secondary mb-8 max-w-lg mx-auto">Your first trial lesson is completely free. No credit card required.</p>
            <Link
              href="/signup?redirect=/dashboard/book"
              className="tactile-btn btn-tactile-dark inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body text-sm font-semibold shadow-sm"
            >
              <span>Book Your Free Trial</span>
              <HugeIcon name="arrow-right" size={16} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
