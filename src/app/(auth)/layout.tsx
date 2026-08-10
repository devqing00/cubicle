import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-near-white flex flex-col justify-between relative overflow-hidden font-body text-text-primary">
      {/* Decorative Glow Mesh Background */}
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-accent-blue rounded-lg"
          aria-label="Return to Cubicle home"
        >
          <span className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Cubicle.
          </span>
        </Link>

        <Link 
          href="/" 
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent-blue transition-colors px-3 py-1.5 rounded-full bg-white border border-border-light shadow-2xs group focus-visible:ring-2 focus-visible:ring-accent-blue"
          aria-label="Back to home page"
        >
          <HugeIcon name="chevron-left" size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 w-full">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-text-subtle relative z-20">
        <div className="flex items-center justify-center gap-6">
          <Link href="/privacy" className="hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue rounded">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue rounded">Terms of Service</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-blue rounded">Help Center</Link>
        </div>
      </footer>
    </div>
  );
}
