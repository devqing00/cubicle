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

      <div className="bg-white p-8 sm:p-12 rounded-[32px] border border-border-light shadow-sm flex flex-col items-center space-y-6 max-w-md w-full text-center relative z-10">
        
        {/* Logo Badge & 404 Tag */}
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
          <span className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-accent-blue text-white rounded-full text-[10px] font-bold shadow-xs">
            404
          </span>
        </div>

        {/* Header & Description */}
        <div>
          <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-3 inline-block">
            Page Not Found
          </span>
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
            className="w-full py-3.5 bg-text-primary text-white rounded-full text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <HugeIcon name="home" size={16} />
            <span>Return to Dashboard</span>
          </Link>
          
          <Link
            href="/"
            className="w-full py-3 bg-surface-near-white text-text-secondary border border-border-light rounded-full text-xs font-medium hover:text-text-primary hover:bg-surface-muted transition-colors flex items-center justify-center gap-2"
          >
            <HugeIcon name="home" size={16} />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
