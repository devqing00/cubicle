"use client";

import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-surface-near-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-[32px] border border-border-light shadow-sm flex flex-col items-center space-y-6 max-w-sm w-full text-center relative z-10">
        {/* Animated Pulsing Logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-accent-blue/20 animate-ping opacity-75" />
          <div className="w-16 h-16 rounded-2xl bg-white border border-border-light p-3 shadow-xs flex items-center justify-center relative z-10">
            <Image
              src="/images/cubicle_logo.png"
              alt="Cubicle Logo"
              width={48}
              height={48}
              className="object-contain animate-pulse"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <div>
          <h2 className="font-heading text-xl font-bold text-text-primary tracking-tight">
            Loading Cubicle
          </h2>
          <p className="font-body text-xs text-text-secondary mt-1">
            Preparing your 1-on-1 language environment...
          </p>
        </div>

        {/* Shimmer Bar */}
        <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-accent-blue rounded-full animate-[shimmer_1.5s_infinite_ease-in-out]" />
        </div>
      </div>
    </div>
  );
}
