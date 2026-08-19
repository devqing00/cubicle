"use client";

import React from "react";
import HugeIcon from "@/components/ui/HugeIcon";

const steps = [
  {
    num: "01",
    title: "Fill in your details",
    description:
      "Tell us your name, age, WhatsApp number, and learning goals. Under 18? We'll include a guardian contact too.",
  },
  {
    num: "02",
    title: "Pick a time slot",
    description:
      "Choose from real available slots on our live calendar. Only times the instructor is free are shown.",
  },
  {
    num: "03",
    title: "Chat on WhatsApp",
    description:
      "You'll connect to WhatsApp with your booking reference pre-filled to introduce yourself and confirm preferences.",
  },
  {
    num: "04",
    title: "Pay to confirm",
    description:
      "Complete payment via OPay, Cards, or Bank Transfer to lock in your slot and receive your Google Meet room link.",
  },
  {
    num: "05",
    title: "Show up & learn",
    description:
      "Get automated WhatsApp confirmations with your Google Meet room link and helpful class reminders.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-surface-near-white">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-16 w-full max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-muted border border-border-light rounded-full text-xs font-medium text-text-secondary mb-4 hover:border-accent-blue/30 transition-colors mx-auto">
            <HugeIcon name="navigation" size={16} className="text-accent-blue" />
            <span>Simple Process</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight tracking-tight w-full text-center">
            How Cubicle <span className="italic text-accent-blue">Works</span>
          </h2>
          <p className="font-body text-base text-text-secondary leading-relaxed w-full max-w-xl mx-auto font-normal text-center mt-4">
            From booking your first session to meeting your tutor—here is your step-by-step journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border border-border-light rounded-[20px] p-6 flex flex-col justify-between shadow-sm hover:border-accent-blue/50 transition-colors group"
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-surface-muted border border-border-light flex items-center justify-center font-heading text-xs font-bold text-text-primary mb-5 group-hover:border-accent-blue/40 group-hover:text-accent-blue transition-colors">
                  {step.num}
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed font-normal w-full">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
