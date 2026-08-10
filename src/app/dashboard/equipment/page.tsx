"use client";

import React from "react";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

export default function EquipmentPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-highlight-blue rounded-full flex items-center justify-center mb-6 border border-border-warm">
        <VideoCameraIcon className="w-10 h-10 text-dark-charcoal" />
      </div>
      <h1 className="font-heading text-4xl font-bold text-oboe-black mb-4">Equipment Testing</h1>
      <p className="font-body text-lg text-mid-gray-brown max-w-md mx-auto mb-8">
        We are building a tool to help you check your camera and microphone before a session. Coming soon!
      </p>
    </div>
  );
}
