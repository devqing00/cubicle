import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen animated-mesh-bg flex flex-col relative overflow-hidden">
      {/* Remove previous radial background decoration */}
      
      <div className="absolute top-8 left-8 z-[100]">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-body text-mid-gray-brown hover:text-oboe-black transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="max-md:hidden">Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center p-6 relative z-10 w-screen max-w-full">
        <div className="w-full max-w-[420px] mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block no-underline">
              <span className="font-heading text-[32px] font-bold text-oboe-black tracking-[-0.3px]">
                Cubicle
              </span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
