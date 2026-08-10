"use client";

import React from "react";
import HugeIcon from "@/components/ui/HugeIcon";

export default function DifferentiatorSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-16 w-full max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-muted border border-border-light rounded-full text-xs font-medium text-text-secondary mb-4 hover:border-accent-blue/30 transition-colors mx-auto">
            <HugeIcon name="sparkles" size={16} className="text-accent-blue" />
            <span>Why Cubicle Stands Out</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight tracking-tight mb-4 w-full text-center">
            Structured learning <span className="italic text-accent-blue">designed around you.</span>
          </h2>
          <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed w-full max-w-xl mx-auto font-normal text-center">
            Pick a time, have a quick chat, and show up to a Google Meet — everything else is handled seamlessly.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          
          {/* Card 1: Real Conversation First */}
          <div className="bg-white border border-border-light rounded-[24px] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:border-accent-blue/50 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center mb-6 text-text-primary group-hover:border-accent-blue/40 group-hover:text-accent-blue transition-colors">
                <HugeIcon name="comment" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                Real conversation first
              </h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed font-normal w-full">
                Before any slot is confirmed, you have a direct WhatsApp chat with your instructor. You aren&apos;t just a calendar invite—we align on your goals upfront.
              </p>
            </div>
          </div>

          {/* Card 2: Instant Scheduling */}
          <div className="bg-white border border-border-light rounded-[24px] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:border-accent-blue/50 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center mb-6 text-text-primary group-hover:border-accent-blue/40 group-hover:text-accent-blue transition-colors">
                <HugeIcon name="calendar" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                Instant scheduling
              </h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed font-normal w-full">
                Pick from real available slots, confirm your booking, and receive an automatically generated Google Meet link right in your confirmation.
              </p>
            </div>
          </div>

          {/* Card 3: Transparent & Fair */}
          <div className="bg-white border border-border-light rounded-[24px] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:border-accent-blue/50 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center mb-6 text-text-primary group-hover:border-accent-blue/40 group-hover:text-accent-blue transition-colors">
                <HugeIcon name="shield" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                Transparent & fair
              </h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed font-normal w-full">
                Clear cancellation and refund policies visible before you pay. No hidden fees, no complicated subscription traps.
              </p>
            </div>
          </div>

          {/* Card 4: Tailored Lessons */}
          <div className="bg-white border border-border-light rounded-[24px] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:border-accent-blue/50 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border-light flex items-center justify-center mb-6 text-text-primary group-hover:border-accent-blue/40 group-hover:text-accent-blue transition-colors">
                <HugeIcon name="brain" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                Lessons shaped around you
              </h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed font-normal w-full">
                Share your age, current level, and learning objectives before your session so your tutor can hit the ground running.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
