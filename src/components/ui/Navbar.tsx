"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const { user, loading } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "About", idx: "01", href: "/about" },
    { name: "Pricing", idx: "02", href: "/pricing" },
    { name: "How it works", idx: "03", href: "/how-it-works" },
    { name: "Policy", idx: "04", href: "/cancellation-policy" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3 pointer-events-none">
        <div
          className={`max-w-[1040px] pl-6 pr-4 pointer-events-auto flex items-center justify-between h-[56px] border ${
            scrolled
              ? "w-full bg-white/85 backdrop-blur-xl border-border-light shadow-xs rounded-full"
              : "w-full bg-white/20 backdrop-blur-xs border-transparent"
          }`}
          style={{
            transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Logo */}
          <Logo variant="blue" size={24} />

          {/* Desktop nav with Swiss Micro-Index Notation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-body text-xs font-semibold text-text-secondary px-3 py-1.5 rounded-full hover:text-accent-blue hover:bg-surface-muted transition-colors flex items-center gap-1.5 group"
              >
                <span>{item.name}</span>
                <span className="font-mono text-[9px] text-text-subtle font-normal group-hover:text-accent-blue/70">
                  {item.idx}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="tactile-btn btn-tactile-dark inline-flex items-center justify-center px-5 py-2 rounded-full font-body text-xs font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="tactile-btn font-body text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup?redirect=/dashboard/book"
                  className="tactile-btn btn-tactile-dark inline-flex items-center justify-center px-5 py-2 rounded-full font-body text-xs font-semibold"
                >
                  Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="lg:hidden flex items-center">
            <button
              className="tactile-btn bg-transparent border-none cursor-pointer p-2 text-text-primary z-[60]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <HugeIcon name="cancel" size={22} />
              ) : (
                <HugeIcon name="menu" size={22} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with Composite Translation */}
      <div
        className={`fixed inset-0 h-[100dvh] w-full bg-white/95 backdrop-blur-2xl z-[40] flex flex-col items-center justify-center gap-8 ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translate3d(0, 0, 0)" : "translate3d(0, -12px, 0)",
          transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <nav className="flex flex-col gap-6 items-center justify-center text-center w-full max-w-xs px-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-heading text-3xl font-bold text-text-primary tracking-tight capitalize hover:text-accent-blue py-1 inline-flex items-center justify-center gap-2 group text-center w-full"
            >
              <span>{item.name}</span>
              <span className="font-mono text-xs font-normal text-text-subtle">({item.idx})</span>
            </Link>
          ))}
          {!loading && user ? (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="tactile-btn btn-tactile-dark mt-6 inline-flex items-center justify-center w-full px-8 py-3.5 rounded-full font-body text-sm font-semibold"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3 w-full mt-6">
              <Link
                href="/signup?redirect=/dashboard/book"
                onClick={() => setMenuOpen(false)}
                className="tactile-btn btn-tactile-dark inline-flex items-center justify-center w-full px-8 py-3.5 rounded-full font-body text-sm font-semibold"
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="tactile-btn btn-tactile-secondary inline-flex items-center justify-center w-full px-8 py-3.5 rounded-full font-body text-sm font-semibold"
              >
                Log In
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
