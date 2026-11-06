"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import HugeIcon from "@/components/ui/HugeIcon";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-surface-near-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="tactile-card p-8 sm:p-12 rounded-[32px] flex flex-col items-center space-y-6 max-w-md w-full text-center relative z-10">
        
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-surface-near-white border border-border-light p-4 shadow-xs flex items-center justify-center">
            <Image
              src="/images/cubicle_logo.png"
              alt="Cubicle Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
        </div>

        {/* Header & Description */}
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">
            Lost your way?
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            The page or session link you are trying to access doesn&apos;t exist or may have been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          <Link
            href="/dashboard"
            className="tactile-btn btn-tactile-dark w-full py-3.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
          >
            <HugeIcon name="home" size={16} />
            <span>Return to Dashboard</span>
          </Link>
          
          <Link
            href="/"
            className="tactile-btn btn-tactile-secondary w-full py-3 rounded-full text-xs font-medium flex items-center justify-center gap-2"
          >
            <HugeIcon name="home" size={16} />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
