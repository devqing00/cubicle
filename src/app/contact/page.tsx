"use client";

import React, { useState } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Inquiry sent successfully! We will get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-[100px] px-6">
        <div className="max-w-[1000px] mx-auto w-full">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider border border-accent-blue/20 mb-4 inline-block">
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-[1.1] mb-4">
              We&apos;re here to <span className="italic text-accent-blue">help.</span>
            </h1>
            <p className="font-body text-sm sm:text-base text-text-secondary">
              Have questions about booking a session or custom corporate training? Send us a message or reach out via WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-[28px] border border-border-light shadow-xs">
              <h3 className="font-heading text-xl font-bold text-text-primary mb-6">Send an Inquiry</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alexander Adetayo"
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary outline-none focus:outline-none focus:ring-0 focus:border-accent-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary outline-none focus:outline-none focus:ring-0 focus:border-accent-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary outline-none focus:outline-none focus:ring-0 focus:border-accent-blue transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-6">
              
              {/* WhatsApp Quick Connect Card */}
              <div className="bg-[#0b291a] text-white p-8 rounded-[28px] border border-emerald-900/40 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                    <HugeIcon name="comment" size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">Instant WhatsApp Support</h4>
                    <p className="font-body text-xs text-emerald-200/80">Average response time: &lt; 15 mins</p>
                  </div>
                </div>
                <p className="font-body text-xs text-emerald-100/90 leading-relaxed mb-6">
                  Need quick help with an active booking reference or rescheduling request? Chat directly with our student support team on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/${(process.env.NEXT_PUBLIC_PLATFORM_WHATSAPP_NUMBER || "2348000000000").replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white rounded-full font-body text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Chat on WhatsApp</span>
                  <HugeIcon name="arrow-right" size={14} />
                </a>
              </div>

              {/* Email Support Card */}
              <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs flex items-center gap-4">
                <div className="w-11 h-11 bg-surface-muted rounded-xl border border-border-light flex items-center justify-center text-text-primary shrink-0">
                  <HugeIcon name="sparkles" size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-text-primary">Email Support</h4>
                  <p className="font-body text-xs text-text-secondary">support@cubicle.com</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
