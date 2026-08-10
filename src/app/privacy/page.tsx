"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[800px] mx-auto w-full">
          
          {/* Header */}
          <div className="mb-12 border-b border-border-light pb-8">
            <span className="px-3.5 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider border border-accent-blue/20 mb-4 inline-block">
              Data & Protection
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-[1.1] mb-3">
              Privacy Policy
            </h1>
            <p className="font-body text-xs text-text-secondary">
              Effective Date: August 10, 2026 • Last Updated: August 2026
            </p>
          </div>

          {/* Document Content */}
          <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
            
            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">1. Information We Collect</h2>
              <p>
                To provide seamless 1-on-1 language tutoring, Cubicle collects basic user information including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-text-secondary font-normal">
                <li>Full name and email address (for authentication and account management).</li>
                <li>WhatsApp phone number (for booking reference verification and lesson feedback).</li>
                <li>Booking history, tier preferences, and lesson feedback notes.</li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">2. How We Use Your Data</h2>
              <p>
                Your personal data is strictly utilized to facilitate live lessons, generate Google Meet video call links, process transactions securely via Paystack, and deliver post-session progress notes on WhatsApp. We do not sell or rent your personal information to third parties.
              </p>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">3. Payments & Security</h2>
              <p>
                Cubicle does not store your full debit card or banking credentials. Financial transactions are securely handled by Paystack, compliant with PCI-DSS standards.
              </p>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">4. Data Retention & Deletion</h2>
              <p>
                You retain full ownership of your data. You can request complete deletion of your account and associated booking history at any time by contacting <a href="mailto:privacy@cubicle.com" className="text-accent-blue font-bold hover:underline">privacy@cubicle.com</a>.
              </p>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
