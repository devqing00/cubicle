"use client";

import React from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[900px] mx-auto w-full">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider border border-accent-blue/20 mb-4 inline-block">
              Policy & Terms
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              Cancellation & Rescheduling <span className="italic text-accent-blue">Policy.</span>
            </h1>
            <p className="font-body text-base text-text-secondary leading-relaxed font-normal">
              Fair, transparent rules designed to respect both student flexibility and instructor preparation time.
            </p>
          </div>

          {/* Policy Cards Grid */}
          <div className="space-y-8 mb-16">
            
            {/* Free Trial Rule */}
            <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col sm:flex-row items-start gap-6">
              <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl border border-accent-blue/20 flex items-center justify-center text-accent-blue shrink-0">
                <HugeIcon name="sparkles" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Free Trial Redemption</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Free trial sessions are limited to strictly <strong>one redemption per student</strong>. If you miss your scheduled free trial session without notice, you may not claim another free trial, but you are welcome to book standard sessions.
                </p>
              </div>
            </div>

            {/* 24-Hour Rescheduling Rule */}
            <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col sm:flex-row items-start gap-6">
              <div className="w-12 h-12 bg-surface-muted rounded-2xl border border-border-light flex items-center justify-center text-text-primary shrink-0">
                <HugeIcon name="calendar" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">24-Hour Rescheduling Rule</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Paid sessions can be rescheduled <strong>free of charge</strong> if requested more than 24 hours prior to the scheduled lesson time. You can request a reschedule directly from your student dashboard or via your instructor&apos;s WhatsApp link.
                </p>
              </div>
            </div>

            {/* Late Cancellations & No-Shows */}
            <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col sm:flex-row items-start gap-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <HugeIcon name="alert" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Late Cancellations & No-Shows</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Cancellations or reschedule requests made less than 24 hours before the session start time, as well as no-shows (failing to join the Google Meet room within 15 minutes of session start), are <strong>non-refundable and non-reschedulable</strong> to compensate instructor time.
                </p>
              </div>
            </div>

            {/* Instructor Cancellation Guarantee */}
            <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-xs flex flex-col sm:flex-row items-start gap-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <HugeIcon name="shield" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Instructor Cancellation Guarantee</h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                  In the rare event that your instructor must cancel a lesson due to an emergency, you will receive an immediate full refund or priority reschedule credit along with a complimentary bonus credit.
                </p>
              </div>
            </div>

          </div>

          {/* Contact Support Note */}
          <div className="text-center bg-surface-muted p-8 rounded-[28px] border border-border-light">
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Need help with a booking?</h3>
            <p className="font-body text-xs text-text-secondary mb-4">Contact our support team directly on WhatsApp for instant assistance.</p>
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_PLATFORM_WHATSAPP_NUMBER || "2348000000000").replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white rounded-full font-body text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <HugeIcon name="comment" size={16} />
              <span>Contact WhatsApp Support</span>
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
