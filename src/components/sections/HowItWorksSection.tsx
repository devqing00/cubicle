"use client";

import React from "react";

const steps = [
  {
    num: "01",
    title: "Fill in your details",
    description:
      "Tell us your name, age, WhatsApp number, and what you want to learn. Under 18? We'll ask for a guardian contact too.",
  },
  {
    num: "02",
    title: "Pick a time slot",
    description:
      "Choose from real available slots on the embedded calendar. Only times the instructor is actually free are shown.",
  },
  {
    num: "03",
    title: "Chat on WhatsApp",
    description:
      "You'll be redirected to WhatsApp with your booking reference pre-filled. Send the message — this is the real conversation step.",
  },
  {
    num: "04",
    title: "Pay to confirm",
    description:
      "After your chat, you'll receive a Paystack payment link. Completing payment locks in your slot and generates your Meet link.",
  },
  {
    num: "05",
    title: "Show up & learn",
    description:
      "You get an automated WhatsApp confirmation with your Google Meet link, and a reminder an hour before the lesson starts.",
  },
];

const hoverBorders = [
  "hover:border-chip-yellow",
  "hover:border-highlight-green",
  "hover:border-chip-orange",
  "hover:border-chip-pink",
  "hover:border-highlight-blue"
];

const baseTransforms = [
  "-rotate-2 translate-y-[0px]",
  "rotate-2 translate-y-[10px]",
  "-rotate-2 translate-y-[20px]",
  "rotate-2 translate-y-[30px]",
  "-rotate-2 translate-y-[40px]"
];

const hoverTransforms = [
  "hover:rotate-0 hover:-translate-y-[10px] hover:scale-[1.02]",
  "hover:rotate-0 hover:translate-y-[0px] hover:scale-[1.02]",
  "hover:rotate-0 hover:translate-y-[10px] hover:scale-[1.02]",
  "hover:rotate-0 hover:translate-y-[20px] hover:scale-[1.02]",
  "hover:rotate-0 hover:translate-y-[30px] hover:scale-[1.02]"
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-[160px] max-md:py-[80px] px-6 bg-highlight-blue relative overflow-hidden"
    >
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-[900px]:top-[10%] max-[900px]:translate-y-0 max-md:top-[80px] w-full text-center z-0 pointer-events-none flex flex-col items-center justify-center">
        <h2 className="font-heading text-[clamp(64px,22vw,360px)] font-bold text-dark-charcoal leading-[0.8] tracking-[-0.05em] m-0 whitespace-nowrap opacity-90">
          HOW IT
        </h2>
        <h2 className="font-heading text-[clamp(120px,22vw,360px)] font-bold text-dark-charcoal leading-[0.8] tracking-[-0.05em] m-0 whitespace-nowrap opacity-90">
          WORKS
        </h2>
      </div>

      <div className="max-w-[1000px] mx-auto relative z-10">
        <div className="flex flex-col gap-6 max-[900px]:mt-[240px] max-md:mt-[280px]">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`w-full max-w-[460px] bg-white rounded-[20px] p-10 shadow-brutal relative border-2 border-transparent transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-default ${
                  isEven ? "self-start" : "self-end"
                } ${baseTransforms[idx]} ${hoverTransforms[idx]} ${hoverBorders[idx]}`}
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-surface-base border border-border-warm flex items-center justify-center font-heading text-base font-bold text-dark-charcoal">
                    {step.num}
                  </div>

                  <div className="pt-2">
                    <h3 className="font-heading text-2xl font-bold text-dark-charcoal mb-3 leading-[1.2]">
                      {step.title}
                    </h3>
                    <p className="font-body text-[15px] font-light text-mid-gray-brown leading-[1.7]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
