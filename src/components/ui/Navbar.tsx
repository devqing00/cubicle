"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();
  
  const hoverColors = ["hover:bg-chip-yellow", "hover:bg-chip-blue", "hover:bg-chip-green", "hover:bg-chip-orange", "hover:bg-chip-pink"];
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (window.location.pathname === "/") {
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-surface-base/92 backdrop-blur-md border-b border-border-warm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-[22px] font-bold text-oboe-black tracking-[-0.3px]">
            Cubicle
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {["About", "Pricing", "Subjects", "Contact"].map((item, idx) => {
            const targetId = item.toLowerCase();
            return (
              <Link
                key={item}
                href={`/#${targetId}`}
                onClick={(e) => handleNavClick(e, targetId)}
                className={`font-body text-sm font-normal text-mid-gray-brown px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out hover:text-oboe-black hover:border hover:border-1px ${hoverColors[idx % hoverColors.length]}`}
              >
                {item}
              </Link>
            );
          })}
        </nav>

        {/* CTA (Desktop) & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 min-w-[160px] justify-end">
            {loading ? (
              <div className="w-[180px] h-[40px] bg-border-warm/30 rounded-full animate-pulse" />
            ) : user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-2.5 bg-oboe-black text-white rounded-full font-body text-sm font-medium border border-oboe-black hover:border hover:border-1px transition-all duration-200 ease-in-out cursor-pointer no-underline shadow-[0_6px_12px_-2px_rgba(36,41,41,0.12)] hover:bg-cta-yellow hover:text-oboe-black hover:border-cta-yellow"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-body text-sm font-medium text-oboe-black hover:text-mid-gray-brown transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-6 py-2.5 bg-oboe-black text-white rounded-full font-body text-sm font-medium border border-oboe-black hover:border hover:border-1px transition-all duration-200 ease-in-out cursor-pointer no-underline shadow-[0_6px_12px_-2px_rgba(36,41,41,0.12)] hover:bg-cta-yellow hover:text-oboe-black hover:border-cta-yellow"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden bg-transparent border-none cursor-pointer p-2 text-oboe-black z-[60]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XMarkIcon width={28} height={28} /> : <Bars3Icon width={28} height={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 h-[100dvh] bg-surface-base z-40 flex flex-col items-center justify-center gap-8 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-2.5"
        }`}
      >
        <nav className="flex flex-col gap-6 items-center">
          {["About", "Pricing", "Subjects", "Contact"].map((item, idx) => {
            const targetId = item.toLowerCase();
            return (
              <Link
                key={item}
                href={`/#${targetId}`}
                onClick={(e) => handleNavClick(e, targetId)}
                className={`font-heading text-[14vw] font-bold text-oboe-black no-underline leading-[0.9] tracking-[-0.04em] uppercase whitespace-nowrap w-auto inline-block px-6 text-center transition-all duration-300 ${hoverColors[idx % hoverColors.length]} hover:text-oboe-black rounded-3xl py-2`}
              >
                {item}
              </Link>
            );
          })}
          {!loading && user ? (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-6 inline-flex items-center px-10 py-4 bg-oboe-black text-white rounded-full font-body text-lg font-medium no-underline shadow-brutal hover:bg-oboe-black/90 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-4 mt-6">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="font-body text-lg font-medium text-mid-gray-brown hover:text-oboe-black transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center px-10 py-4 bg-oboe-black text-white rounded-full font-body text-lg font-medium no-underline shadow-brutal hover:bg-oboe-black/90 hover:border hover:border-1px transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
