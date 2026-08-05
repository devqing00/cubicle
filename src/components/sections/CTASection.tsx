"use client";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      id="booking"
      className="px-6 pb-[120px] bg-surface-base"
    >
      <div 
        className="max-w-[1200px] mx-auto bg-chip-yellow rounded-b-[32px] max-md:rounded-b-[24px] pt-[80px] pb-[80px] max-md:pt-[60px] max-md:pb-[24px] px-6 max-md:px-10 text-center border-x border-b border-border-warm flex flex-col items-center relative overflow-hidden"
      >
        {/* Subtle decorative circles */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/40 -top-[100px] -right-[50px] blur-[40px]" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/40 -bottom-[50px] -left-[50px] blur-[40px]" />

        <h2 className="font-heading text-[clamp(36px,10vw,120px)] font-bold text-oboe-black leading-[0.9] tracking-[-0.03em] mb-6 uppercase relative z-10">
          YOUR FIRST LESSON IS <br/>
          <em className="italic text-white bg-oboe-black pt-2 pb-3 md:pt-0 px-4 md:pl-4 md:pr-[35px] rounded-2xl inline-block mt-3 max-md:mt-4 whitespace-nowrap overflow-hidden max-w-[90vw] text-ellipsis">
            COMPLETELY FREE!
          </em>
        </h2>

        <p className="font-body text-lg font-normal text-mid-gray-brown leading-[1.6] mb-12 max-w-[480px] relative z-10">
          No commitment. No payment info upfront. Just show up, have a
          conversation, and see if this is the right fit for you.
        </p>

        <Link
          href="/signup"
          id="cta-whatsapp-btn"
          className="inline-flex items-center gap-3 py-5 px-12 bg-oboe-black text-white rounded-full font-body text-lg font-semibold transition-all duration-250 ease-in-out cursor-pointer no-underline relative z-10 shadow-brutal hover:bg-chip-pink hover:text-oboe-black"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          Book now
        </Link>

        {/* Policy note */}
        <div className="mt-16 p-5 md:px-6 bg-white/40 rounded-2xl border border-[#ddd7d5]/40 relative z-10 max-w-[600px]">
          <p className="font-body text-xs font-normal text-mid-gray-brown leading-[1.6]">
            Free trial limited to one redemption per student. Paid sessions
            can be rescheduled free of charge if requested more than 24 hours
            in advance. No-shows are non-refundable.
          </p>
        </div>
      </div>
    </section>
  );
}
