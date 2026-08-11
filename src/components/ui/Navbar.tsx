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
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "How it works", href: "/how-it-works" },
    { name: "Policy", href: "/cancellation-policy" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3 pointer-events-none transition-all duration-300">
        <div
          className={`max-w-[1000px] pl-6 pr-4 pointer-events-auto transition-all duration-300 ease-in-out flex items-center justify-between h-[56px] ${
            scrolled
              ? "w-full bg-white/80 backdrop-blur-xl shadow-none rounded-full"
              : "w-full bg-white/0 backdrop-blur-none"
          }`}
        >
          {/* Logo */}
          <Logo variant="blue" size={24} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-body text-sm font-medium text-text-secondary px-3 py-1.5 rounded-full transition-colors hover:text-accent-blue hover:bg-surface-muted capitalize"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2 bg-text-primary text-white rounded-full font-body text-sm font-medium hover:bg-black transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-body text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup?redirect=/dashboard/book"
                  className="inline-flex items-center justify-center px-5 py-2 bg-text-primary text-white rounded-full font-body text-sm font-medium hover:bg-black transition-colors"
                >
                  Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="lg:hidden flex items-center">
            <button
              className="lg:hidden bg-transparent border-none cursor-pointer p-2 text-text-primary z-[60]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <HugeIcon name="cancel" size={24} />
              ) : (
                <HugeIcon name="menu" size={24} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 h-[100dvh] w-full bg-white/95 backdrop-blur-2xl z-[40] flex flex-col items-center justify-center gap-8 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <nav className="flex flex-col gap-6 items-center justify-center text-center w-full max-w-xs px-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight capitalize transition-colors hover:text-accent-blue py-1 inline-flex items-center justify-center gap-2 group text-center w-full"
            >
              <span>{item.name}</span>
              <HugeIcon name="arrow-up-right" size={22} className="text-text-subtle group-hover:text-accent-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          ))}
          {!loading && user ? (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-6 inline-flex items-center justify-center w-full px-8 py-3.5 bg-text-primary text-white rounded-full font-body text-base font-medium hover:bg-black transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3 w-full mt-6">
              <Link
                href="/signup?redirect=/dashboard/book"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center w-full px-8 py-3.5 bg-text-primary text-white rounded-full font-body text-base font-medium hover:bg-black transition-colors"
              >
                Free Trial
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center w-full px-8 py-3.5 bg-surface-muted text-text-primary border border-border-light rounded-full font-body text-base font-medium hover:bg-border-light transition-colors"
              >
                Log in
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
