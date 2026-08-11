"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addDoc, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";
import NativeScheduler from "@/components/booking/NativeScheduler";
import { getUserLocalTimeZone } from "@/lib/timezone";

interface BookingResult {
  reference: string;
  tier: "trial" | "standard" | "intensive";
  scheduledDate: string;
  scheduledTime: string;
  formattedSchedule: string;
  meetLink: string;
  meetingCode?: string;
  status: "confirmed" | "paid" | "pending_payment";
}

export default function BookingPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [selectedTier, setSelectedTier] = useState<"trial" | "standard" | "intensive" | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"tier_selection" | "calendar" | "confirmation">("tier_selection");
  const [hasClaimedTrial, setHasClaimedTrial] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/dashboard/book");
      } else if (userData?.role === "tutor") {
        toast.error("Tutors cannot book sessions for themselves. Redirecting to tutor overview.");
        router.replace("/dashboard");
      } else if (userData && !userData.onboardingComplete) {
        router.push("/onboarding");
      }
    }
  }, [user, userData, loading, router]);

  // Check if student already claimed a trial session
  useEffect(() => {
    const checkTrialStatus = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "bookings"),
            where("studentId", "==", user.uid)
          );
          const snapshot = await getDocs(q);
          const docs = snapshot.docs.map(d => d.data());
          const hasTrial = docs.some(d => d.tier === "trial");
          if (hasTrial) {
            setHasClaimedTrial(true);
          }
        } catch (error) {
          console.error("Error checking trial eligibility:", error);
        }
      }
    };
    checkTrialStatus();
  }, [user]);

  const handleSlotConfirmed = async (slot: { date: string; time: string; formattedDate: string }) => {
    if (!user || !selectedTier) return;
    setIsSubmitting(true);

    try {
      const studentName = userData?.displayName || userData?.fullName || user.displayName || "Student";
      const studentEmail = user.email || "";

      // Call our backend API to programmatically provision real Cal.com Google Meet room
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user.uid,
          studentName,
          studentEmail,
          tier: selectedTier,
          scheduledDate: slot.date,
          scheduledTime: slot.time,
          formattedSchedule: slot.formattedDate,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create booking");
      }

      const resultData: BookingResult = {
        reference: data.reference,
        tier: selectedTier,
        scheduledDate: slot.date,
        scheduledTime: slot.time,
        formattedSchedule: slot.formattedDate,
        meetLink: data.meetLink,
        status: data.status,
      };

      if (selectedTier === "trial") {
        setBookingResult(resultData);
        setBookingStatus("confirmation");
        toast.success("Free trial booked successfully!");
      } else {
        // Paid lesson flow: Initialize Paystack checkout
        try {
          const payRes = await fetch("/api/paystack/initialize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: data.id })
          });

          const payData = await payRes.json();
          if (payData.authorization_url) {
            // Redirect to Paystack secure checkout
            window.location.href = payData.authorization_url;
            return;
          }
        } catch (e) {
          console.warn("Paystack initialize skipped, showing confirmation:", e);
        }

        // On-platform confirmation fallback
        setBookingResult(resultData);
        setBookingStatus("confirmation");
        toast.success(`Lesson reserved for ${slot.formattedDate}!`);
      }
    } catch (error: unknown) {
      console.error("Failed to create booking", error);
      const msg = error instanceof Error ? error.message : "Failed to reserve session";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !userData) {
    return (
      <div className="min-h-screen bg-surface-near-white flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading booking page...</span>
        </div>
      </div>
    );
  }

  const tutorWhatsAppNumber = (process.env.NEXT_PUBLIC_TUTOR_WHATSAPP || "2348000000000").replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-surface-near-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent-blue font-body text-xs font-medium transition-colors mb-8 group">
          <HugeIcon name="chevron-left" size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Step 1: Tier Selection */}
        {bookingStatus === "tier_selection" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">Select your lesson type</h1>
              <span className="px-3 py-1 bg-surface-muted text-text-secondary rounded-full text-xs font-semibold self-start sm:self-auto flex items-center gap-1.5">
                <HugeIcon name="clock" size={13} className="text-accent-blue" />
                <span>Timezone: Africa/Lagos (WAT) • Local: {getUserLocalTimeZone()}</span>
              </span>
            </div>
            <p className="font-body text-sm sm:text-base text-text-secondary mb-10">Choose the session that fits your goals. You&apos;ll pick a time slot on the next step.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "trial", name: "Free Trial", price: "₦0", desc: "First session only" },
                { id: "standard", name: "Standard", price: "₦15,000", desc: "60-minute lesson" },
                { id: "intensive", name: "Intensive", price: "₦25,000", desc: "90-minute lesson" },
              ].map((tier) => {
                const isDisabled = tier.id === "trial" && hasClaimedTrial;
                return (
                <button
                  key={tier.id}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelectedTier(tier.id as "trial" | "standard" | "intensive");
                    setBookingStatus("calendar");
                  }}
                  disabled={isDisabled}
                  className={`bg-white p-8 rounded-[28px] border border-border-light shadow-xs transition-all text-left flex flex-col justify-between min-h-[260px] ${
                    isDisabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:border-accent-blue/50 hover:shadow-md cursor-pointer group"
                  }`}
                >
                  <div>
                    <span className="inline-block px-3 py-1 bg-surface-muted border border-border-light rounded-full text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-6">
                      {isDisabled ? "Already Claimed" : tier.desc}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">{tier.name}</h3>
                    <p className="font-heading text-3xl font-bold text-text-primary">{tier.price}</p>
                  </div>
                  <div className="w-full pt-4 border-t border-border-light flex items-center justify-between">
                    <span className={`text-xs font-semibold font-body ${isDisabled ? "text-text-subtle" : "text-accent-blue group-hover:underline"}`}>
                      {isDisabled ? "Unavailable" : "Select session"}
                    </span>
                    {!isDisabled && <HugeIcon name="arrow-right" size={16} className="text-accent-blue group-hover:translate-x-1 transition-transform" />}
                  </div>
                </button>
              )})}
            </div>
          </div>
        )}

        {/* Step 2: Native Calendar Date/Time Picker */}
        {bookingStatus === "calendar" && selectedTier && (
          <NativeScheduler
            selectedTier={selectedTier}
            onSelectSlot={handleSlotConfirmed}
            onBack={() => setBookingStatus("tier_selection")}
            loading={isSubmitting}
          />
        )}

        {/* Step 3: Instant On-Platform Booking Confirmation */}
        {bookingStatus === "confirmation" && bookingResult && (
          <div className="bg-white p-8 sm:p-12 rounded-[28px] border border-border-light shadow-md max-w-2xl mx-auto text-center space-y-6">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <HugeIcon name="check" size={28} />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200 mb-2 inline-block">
                Session Confirmed
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                You&apos;re All Set!
              </h2>
              <p className="font-body text-xs sm:text-sm text-text-secondary mt-1">
                Your 1-on-1 language session is officially scheduled.
              </p>
            </div>

            {/* Booking Details Box */}
            <div className="bg-surface-near-white p-6 rounded-2xl border border-border-light text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border-light">
                <span className="font-body text-xs text-text-secondary">Booking Reference</span>
                <span className="font-heading font-bold text-sm text-text-primary">{bookingResult.reference}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border-light">
                <span className="font-body text-xs text-text-secondary">Scheduled Time</span>
                <span className="font-heading font-bold text-sm text-accent-blue">{bookingResult.formattedSchedule}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border-light">
                <span className="font-body text-xs text-text-secondary">Lesson Type</span>
                <span className="font-heading font-bold text-sm text-text-primary capitalize">{bookingResult.tier} Lesson</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border-light">
                <span className="font-body text-xs text-text-secondary">Meeting Room Code</span>
                <div className="flex items-center gap-2">
                  <code className="px-2.5 py-1 bg-white border border-border-light rounded-lg font-mono font-bold text-xs text-text-primary">
                    {bookingResult.meetingCode || bookingResult.meetLink.split("/").pop()}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      const code = bookingResult.meetingCode || bookingResult.meetLink.split("/").pop() || "";
                      navigator.clipboard.writeText(code);
                      toast.success(`Meeting code "${code}" copied!`);
                    }}
                    className="px-2.5 py-1 bg-surface-muted hover:bg-surface-near-white border border-border-light rounded-md text-[10px] font-semibold text-text-secondary transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-1">
                <span className="font-body text-xs text-text-secondary">Meeting Room URL</span>
                <a 
                  href={bookingResult.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading font-bold text-xs text-accent-blue hover:underline break-all"
                >
                  {bookingResult.meetLink}
                </a>
              </div>
            </div>

            {/* In-App Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href={bookingResult.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 bg-accent-blue text-white rounded-full font-body text-xs font-semibold hover:bg-accent-blue-hover transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <HugeIcon name="sparkles" size={16} />
                <span>{bookingResult.meetLink.includes("meet.google.com") ? "Join Google Meet" : "Join Video Room"}</span>
              </Link>

              <Link
                href="/dashboard/chat"
                className="py-3.5 px-4 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <HugeIcon name="comment" size={16} />
                <span>Chat with Instructor</span>
              </Link>
            </div>

            {/* Optional WhatsApp Inquiry Link */}
            <div className="pt-4 border-t border-border-light flex items-center justify-center gap-2 text-xs text-text-secondary">
              <span>Have a question?</span>
              <a
                href={`https://wa.me/${tutorWhatsAppNumber}?text=${encodeURIComponent(`Hi, I have a question about my booking ${bookingResult.reference} (${bookingResult.formattedSchedule})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] font-semibold hover:underline flex items-center gap-1"
              >
                <span>WhatsApp Tutor Directly</span>
                <HugeIcon name="arrow-up-right" size={12} />
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
