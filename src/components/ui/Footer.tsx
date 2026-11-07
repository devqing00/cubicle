"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Logo from "@/components/ui/Logo";

const platformNumber = (process.env.NEXT_PUBLIC_PLATFORM_WHATSAPP_NUMBER || "2348000000000").replace(/[^0-9]/g, '');

const socials = [
  { name: "WhatsApp", href: `https://wa.me/${platformNumber}` },
  { name: "Instagram", href: "https://instagram.com/thecubicle" },
  { name: "LinkedIn", href: "https://linkedin.com/company/thecubicle" },
  { name: "Twitter / X", href: "https://x.com/thecubicle" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-near-white pt-20 pb-12 relative overflow-hidden border-t border-border-light">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col">
        
        {/* Top Grid: Big Editorial Contact Callout & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border-light">
          
          {/* Left Column: Brand & Big Direct Action (FUEL Style) */}
          <div className="md:col-span-7 space-y-6">
            <Logo variant="blue" size={26} />
            
            <h3 className="font-heading text-2xl sm:text-4xl font-bold text-text-primary tracking-tight leading-snug">
              Personalized language learning. <br />
              Direct with verified tutors.
            </h3>

            <p className="font-body text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed font-normal">
              Structured speaking dialogues tailored to your career, exam, and relocation milestones. Pick a slot, introduce yourself on WhatsApp, and start speaking.
            </p>

            <div className="pt-2">
              <Link
                href="/signup?redirect=/dashboard/book"
                className="swiss-link text-sm font-bold text-text-primary hover:text-accent-blue"
              >
                <span>Book Your Complimentary Trial Session</span>
                <HugeIcon name="arrow-up-right" size={16} />
              </Link>
            </div>
          </div>

          {/* Right Column: Swiss Indexed Links */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle font-bold">
                Platform
              </span>
              <ul className="space-y-2.5">
                {[
                  { name: "About", idx: "01", href: "/about" },
                  { name: "Pricing", idx: "02", href: "/pricing" },
                  { name: "How It Works", idx: "03", href: "/how-it-works" },
                  { name: "Cancellation Policy", idx: "04", href: "/cancellation-policy" },
                  { name: "FAQ", idx: "05", href: "/faq" },
                  { name: "Contact & Support", idx: "06", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-body text-xs font-semibold text-text-secondary hover:text-accent-blue transition-colors flex items-center justify-between group"
                    >
                      <span>{link.name}</span>
                      <span className="font-mono text-[9px] text-text-subtle group-hover:text-accent-blue/70">
                        {link.idx}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle font-bold">
                Connect
              </span>
              <ul className="space-y-2.5">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs font-semibold text-text-secondary hover:text-accent-blue transition-colors flex items-center justify-between group"
                    >
                      <span>{s.name}</span>
                      <HugeIcon name="arrow-up-right" size={12} className="text-text-subtle group-hover:text-accent-blue" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-text-subtle">
          <div>
            © 2026 Cubicle Language Learning. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cancellation-policy" className="hover:text-text-primary transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
