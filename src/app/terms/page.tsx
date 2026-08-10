"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[800px] mx-auto w-full">
          
          {/* Header */}
          <div className="mb-12 border-b border-border-light pb-8">
            <span className="px-3.5 py-1 bg-surface-muted text-text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-border-light mb-4 inline-block">
              Legal Agreement
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-[1.1] mb-3">
              Terms of Service
            </h1>
            <p className="font-body text-xs text-text-secondary">
              Effective Date: August 10, 2026 • Last Updated: August 2026
            </p>
          </div>

          {/* Document Content */}
          <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
            
            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">1. Overview & Acceptance</h2>
              <p>
                Welcome to Cubicle. By creating an account, booking a trial session, or using any services offered on this platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">2. Student Accounts & Responsibilities</h2>
              <p>
                Students are responsible for providing accurate contact details, including a valid email address and WhatsApp telephone number for booking verification and link delivery. Accounts are strictly personal and non-transferable.
              </p>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">3. Lesson Bookings & Payments</h2>
              <p>
                All paid session fees are collected upfront via our secure payment provider (Paystack). A booking is considered confirmed only once payment has been successfully processed and verified.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-text-secondary font-normal">
                <li>Free Trial sessions are restricted to 1 redemption per user.</li>
                <li>Standard 60-minute sessions are billed at ₦15,000.</li>
                <li>Intensive 90-minute sessions are billed at ₦25,000.</li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">4. Code of Conduct</h2>
              <p>
                Cubicle maintains a strict zero-tolerance policy against harassment, offensive language, or disruptive behavior during live Google Meet sessions. Instructors reserve the right to immediately terminate any session if a student violates this conduct policy without refund.
              </p>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">5. Intellectual Property</h2>
              <p>
                All curriculum materials, lesson plans, software UI, logos, and custom graphics displayed on Cubicle are the exclusive property of Cubicle. Unauthorized distribution or copying is strictly prohibited.
              </p>
            </section>

            <section className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs space-y-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">6. Contact Information</h2>
              <p>
                If you have any questions regarding these Terms of Service, please reach out to us at <a href="mailto:support@cubicle.com" className="text-accent-blue font-bold hover:underline">support@cubicle.com</a> or via our WhatsApp channel.
              </p>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
