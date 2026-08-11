"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled runtime error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-surface-near-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white p-8 sm:p-12 rounded-[32px] border border-border-light shadow-sm flex flex-col items-center space-y-6 max-w-md w-full text-center relative z-10">
        
        {/* Logo Badge & Warning Icon */}
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
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-xs">
            ⚠️
          </div>
        </div>

        {/* Header & Message */}
        <div>
          <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-500/20 mb-3 inline-block">
            System Alert
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">
            Something went wrong
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            An unexpected error occurred while loading this page. Don&apos;t worry, your data and bookings remain secure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 bg-text-primary text-white rounded-full text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <HugeIcon name="sparkles" size={16} />
            <span>Try Again</span>
          </button>
          
          <Link
            href="/dashboard"
            className="w-full py-3 bg-surface-near-white text-text-secondary border border-border-light rounded-full text-xs font-medium hover:text-text-primary hover:bg-surface-muted transition-colors flex items-center justify-center gap-2"
          >
            <HugeIcon name="home" size={16} />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
