"use client";

import React from "react";
import Image from "next/image";

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center font-body space-y-5">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-white border border-border-light p-2.5 shadow-xs flex items-center justify-center">
          <Image
            src="/images/cubicle_logo.png"
            alt="Cubicle Logo"
            width={40}
            height={40}
            className="object-contain animate-pulse"
            priority
          />
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-base text-text-primary">
          Loading Dashboard
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Fetching your upcoming schedule and active sessions...
        </p>
      </div>

      <div className="w-48 h-1 bg-surface-muted rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-accent-blue rounded-full animate-[shimmer_1.5s_infinite_ease-in-out]" />
      </div>
    </div>
  );
}
