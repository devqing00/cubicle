"use client";

import React from "react";
import { ChatBubbleLeftRightIcon, LockClosedIcon, CalendarIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function DifferentiatorSection() {
  return (
    <section
      id="about"
      className="pt-[60px] pb-[120px] max-md:pb-[60px] px-6 bg-surface-base relative z-10"
    >
      <div className="max-w-[1100px] mx-auto">
        
        {/* Secondary Header & CTAs */}
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="font-heading text-[clamp(48px,8vw,80px)] font-bold text-dark-charcoal leading-[1.1] tracking-[-0.5px] mb-6">
            Structured learning{" "}
            <span className="bg-[linear-gradient(transparent_60%,var(--color-highlight-blue)_60%,var(--color-highlight-blue)_100%)] px-1 -mx-1">
              designed around you.
            </span>
          </h2>
          <p className="font-body text-[18px] font-light text-mid-gray-brown leading-[1.8] max-w-[600px] mb-10">
            Pick a time, have a quick chat, and show up to a Google Meet — everything else
            is handled. No automated bots, no cold booking into an empty calendar.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-oboe-black text-white rounded-full font-body text-[15px] font-medium transition-all duration-200 ease-in-out cursor-pointer no-underline hover:bg-[#1a1614]"
            >
              Book a lesson
            </a>
            
            <a
              href="#pricing"
              className="inline-flex items-center px-8 py-3.5 bg-cta-yellow text-oboe-black rounded-full font-body text-[15px] font-medium border border-border-warm transition-all duration-200 ease-in-out cursor-pointer no-underline hover:bg-chip-yellow hover:border-border-warm"
            >
              Free trial session
            </a>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid gap-6 grid-cols-1 min-[901px]:grid-cols-[1.2fr_1fr]">
          
          {/* LEFT: Large Card with Photo */}
          <div className="relative bg-oboe-black rounded-[24px] p-10 min-h-[480px] flex flex-col justify-start overflow-hidden shadow-brutal">
            {/* Subtle background glow for dark card */}
            <div className="absolute -top-[50px] -right-[50px] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(254,241,204,0.1)_0%,transparent_70%)]" />
            
            {/* Massive Watermark Icon */}
            <div className="absolute top-[10%] -right-[10%] z-0 opacity-5 -rotate-[15deg] pointer-events-none">
              <ChatBubbleLeftRightIcon className="w-[380px] h-[380px] text-highlight-green" />
            </div>
            
            <div className="relative z-10 max-w-[340px]">
              <div className="mb-5">
                <ChatBubbleLeftRightIcon className="w-9 h-9 text-highlight-green" />
              </div>
              <h3 className="font-heading text-[28px] font-bold text-white mb-4 leading-[1.2]">
                Real conversation first
              </h3>
              <p className="font-body text-[15px] font-light text-[#d6cdc9] leading-[1.8]">
                Before any slot is confirmed, you have a real WhatsApp chat with the instructor. You aren&apos;t just a calendar invite.
              </p>
            </div>

            {/* Overlapping Stat Card (Bottom Left) */}
            <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-6 w-[calc(100%-48px)] max-w-[340px] shadow-brutal flex flex-col gap-3 z-20 overflow-hidden">
              {/* Massive Watermark Icon */}
              <div className="absolute -bottom-[20%] -right-[10%] z-0 opacity-10 rotate-[10deg] pointer-events-none">
                <LockClosedIcon className="w-[160px] h-[160px] text-chip-orange" />
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <span>
                  <LockClosedIcon className="w-6 h-6 text-chip-orange" />
                </span>
                <h4 className="font-heading text-[20px] font-semibold text-dark-charcoal m-0">
                  Transparent & fair
                </h4>
              </div>
              <p className="font-body text-[13px] font-light text-mid-gray-brown leading-[1.6] m-0 relative z-10">
                Clear cancellation and refund policies, visible before you pay. No hidden fees, no ambiguity.
              </p>
            </div>
          </div>

          {/* RIGHT: Stacked Cards */}
          <div className="flex flex-col gap-6">
            
            {/* Top Right Card (Dark/Accent) */}
            <div className="bg-dark-charcoal rounded-[24px] p-10 flex-1 flex flex-col justify-center relative overflow-hidden shadow-brutal">
              <div className="absolute -bottom-[50px] -right-[20px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(171,198,182,0.15)_0%,transparent_70%)]" />
              
              {/* Massive Watermark Icon */}
              <div className="absolute -bottom-[15%] -right-[5%] z-0 opacity-5 -rotate-[10deg] pointer-events-none">
                <CalendarIcon className="w-[260px] h-[260px] text-highlight-blue" />
              </div>
              
              <div className="relative z-10">
                <div className="mb-5">
                  <CalendarIcon className="w-8 h-8 text-highlight-blue" />
                </div>
                <h3 className="font-heading text-[24px] font-bold text-white mb-3 leading-[1.2]">
                  Instant scheduling
                </h3>
                <p className="font-body text-[15px] font-light text-[#d6cdc9] leading-[1.7]">
                  Pick from real available slots, pay to confirm, and get a Google Meet link automatically generated — all in one flow.
                </p>
              </div>
            </div>

            {/* Bottom Right Card (Light) */}
            <div className="bg-white border border-border-warm rounded-[24px] p-10 flex-1 flex flex-col justify-center relative overflow-hidden shadow-brutal">
              {/* Massive Watermark Icon */}
              <div className="absolute -top-[10%] -right-[10%] z-0 opacity-10 rotate-[15deg] pointer-events-none">
                <SparklesIcon className="w-[240px] h-[240px] text-chip-yellow" />
              </div>

              <div className="relative z-10">
                <div className="mb-5">
                  <SparklesIcon className="w-8 h-8 text-chip-yellow" />
                </div>
                <h3 className="font-heading text-[24px] font-bold text-dark-charcoal mb-3 leading-[1.2]">
                  Lessons shaped around you
                </h3>
                <p className="font-body text-[15px] font-light text-mid-gray-brown leading-[1.7]">
                  Share your goals before you book. The instructor reviews them so your first lesson hits the ground running.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
