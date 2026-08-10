"use client";

import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function SubjectsPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-highlight-green rounded-full flex items-center justify-center mb-6 border border-border-warm">
        <AcademicCapIcon className="w-10 h-10 text-dark-charcoal" />
      </div>
      <h1 className="font-heading text-4xl font-bold text-oboe-black mb-4">Subject Catalog</h1>
      <p className="font-body text-lg text-mid-gray-brown max-w-md mx-auto">
        We are currently building out an extensive library of subjects for you to explore. Check back soon!
      </p>
    </div>
  );
}
