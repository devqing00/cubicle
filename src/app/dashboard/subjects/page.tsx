"use client";

import React from "react";
import HugeIcon from "@/components/ui/HugeIcon";

export default function SubjectsPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6 border border-accent-blue/20 text-accent-blue">
        <HugeIcon name="brain" size={32} />
      </div>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-3">Subject Catalog</h1>
      <p className="font-body text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
        We are currently building out an extensive catalog of language modules and subjects. Check back soon for new curriculum updates!
      </p>
    </div>
  );
}
