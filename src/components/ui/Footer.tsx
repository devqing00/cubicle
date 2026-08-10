"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";

const platformNumber = (process.env.NEXT_PUBLIC_PLATFORM_WHATSAPP_NUMBER || "2348000000000").replace(/[^0-9]/g, '');

const socials = [
  { name: "WhatsApp", href: `https://wa.me/${platformNumber}`, iconName: "comment" as const },
  { name: "Instagram", href: "https://instagram.com/thecubicle", iconName: "instagram" as const },
  { name: "LinkedIn", href: "https://linkedin.com/company/thecubicle", iconName: "linkedin" as const },
  { name: "TikTok", href: "https://tiktok.com/@thecubicle", iconName: "tiktok" as const },
  { name: "Facebook", href: "https://facebook.com/thecubicle", iconName: "facebook" as const },
];

export default function Footer() {
  return (
    <footer className="bg-surface-near-white pt-[80px] pb-12 relative overflow-hidden border-t border-border-subtle">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col">
        <div className="flex items-start justify-between flex-wrap gap-12 relative z-10">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-heading text-2xl font-bold text-text-primary tracking-tight">
              Cubicle.
            </Link>
            <p className="font-body text-[15px] font-normal text-text-secondary max-w-[280px] leading-[1.7] block">
              A softer, smarter way to learn. Real conversations, entirely built around your pace and goals.
            </p>
          </div>

          <div className="flex gap-8 md:gap-16 flex-col md:flex-row flex-wrap">
            {/* Navigation Column */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Navigation</h4>
              {[
                { name: "About", href: "/about" },
                { name: "Pricing", href: "/pricing" },
                { name: "How it works", href: "/how-it-works" },
                { name: "Cancellation policy", href: "/cancellation-policy" },
                { name: "FAQ", href: "/faq" },
                { name: "Contact & Support", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-body text-[14px] font-medium text-text-secondary no-underline inline-flex items-center gap-1 transition-colors hover:text-accent-blue group"
                >
                  <span>{link.name}</span>
                  <HugeIcon name="arrow-up-right" size={14} className="text-text-subtle group-hover:text-accent-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Socials Column */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Social</h4>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    id={`footer-social-${s.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center transition-colors bg-white text-text-secondary hover:bg-surface-muted hover:text-accent-blue hover:border-accent-blue/40"
                  >
                    <HugeIcon name={s.iconName} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="w-auto font-body text-[13px] font-normal text-text-subtle">
            © {new Date().getFullYear()} Cubicle. All rights reserved.
          </p>
          <div className="flex gap-6 items-center whitespace-nowrap shrink-0">
            <Link href="/privacy" className="font-body text-[13px] font-normal text-text-subtle hover:text-text-primary transition-colors whitespace-nowrap">Privacy Policy</Link>
            <Link href="/terms" className="font-body text-[13px] font-normal text-text-subtle hover:text-text-primary transition-colors whitespace-nowrap">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
