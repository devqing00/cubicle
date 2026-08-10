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

export default function BookingPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [selectedTier, setSelectedTier] = useState<"trial" | "standard" | "intensive" | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"tier_selection" | "calendar" | "whatsapp_verification">("tier_selection");
  const [hasClaimedTrial, setHasClaimedTrial] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/dashboard/book");
      } else if (userData && !userData.onboardingComplete && userData.role !== "tutor") {
        router.push("/onboarding");
      }
    }
  }, [user, userData, loading, router]);

  // Restore state on mount if they refreshed the page
  useEffect(() => {
    const checkExistingDraft = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "bookings"),
            where("studentId", "==", user.uid)
          );
          const snapshot = await getDocs(q);
          const docs = snapshot.docs.map(d => d.data());

          // Find latest pending whatsapp verification draft
          const pendingDraft = docs
            .filter(d => d.status === "pending_wa")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

          if (pendingDraft) {
            setBookingRef(pendingDraft.reference);
            setBookingStatus("whatsapp_verification");
          }

          // Check if user already claimed a trial session
          const hasTrial = docs.some(d => d.tier === "trial");
          if (hasTrial) {
            setHasClaimedTrial(true);
          }
        } catch (error) {
          console.error("Error checking for existing drafts or trials:", error);
        }
      }
    };
    checkExistingDraft();
  }, [user, bookingStatus]);

  const handleSlotConfirmed = async (slot: { date: string; time: string; formattedDate: string }) => {
    if (!user || !selectedTier) return;
    setIsSubmitting(true);

    try {
      const array = new Uint8Array(3);
      window.crypto.getRandomValues(array);
      const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      const ref = `CUB-${hex}`;

      await addDoc(collection(db, "bookings"), {
        studentId: user.uid,
        studentName: userData?.displayName || userData?.fullName || user.displayName || "Student",
        studentEmail: user.email,
        reference: ref,
        tier: selectedTier,
        scheduledDate: slot.date,
        scheduledTime: slot.time,
        formattedSchedule: slot.formattedDate,
        status: "pending_wa",
        createdAt: new Date().toISOString(),
      });

      setBookingRef(ref);
      setBookingStatus("whatsapp_verification");
      toast.success(`Reserved for ${slot.formattedDate}!`);
    } catch (error) {
      console.error("Failed to create draft booking", error);
      toast.error("Failed to reserve session. Please try again.");
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

  return (
    <div className="min-h-screen bg-surface-near-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent-blue font-body text-xs font-medium transition-colors mb-8 group">
          <HugeIcon name="chevron-left" size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        {bookingStatus === "tier_selection" && (
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-3">Select your lesson type</h1>
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

        {bookingStatus === "calendar" && selectedTier && (
          <NativeScheduler
            selectedTier={selectedTier}
            onSelectSlot={handleSlotConfirmed}
            onBack={() => setBookingStatus("tier_selection")}
            loading={isSubmitting}
          />
        )}

        {bookingStatus === "whatsapp_verification" && (
          <div className="bg-white p-8 sm:p-12 rounded-[28px] border border-border-light shadow-md text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center mx-auto mb-6">
              <HugeIcon name="comment" size={24} />
            </div>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">Almost there!</h2>
            <p className="font-body text-text-secondary mb-8 text-sm sm:text-base leading-relaxed">
              To prevent spam and ensure you get a personal instructor response, we require a quick WhatsApp verification.
            </p>
            
            <div className="bg-surface-near-white p-6 rounded-2xl border border-border-light mb-8 text-center">
              <p className="font-body text-xs text-text-secondary mb-1 uppercase tracking-wider font-semibold">Your Booking Reference</p>
              <p className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-widest">{bookingRef}</p>
            </div>

            <div className="text-left mb-6">
              <label htmlFor="student-wa-number" className="block font-body text-xs font-semibold text-text-primary mb-2 uppercase tracking-wider">
                Your WhatsApp Number (for updates)
              </label>
              <input
                id="student-wa-number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234..."
                className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-sm transition-colors focus:border-accent-blue"
              />
            </div>

            <button 
              onClick={async () => {
                if (phone) {
                  try {
                    const q = query(collection(db, "bookings"), where("reference", "==", bookingRef));
                    const snapshot = await getDocs(q);
                    if (!snapshot.empty) {
                      const docRef = doc(db, "bookings", snapshot.docs[0].id);
                      await updateDoc(docRef, { studentWhatsApp: phone });
                    }
                  } catch (e) {}
                }
                const platformNumber = process.env.NEXT_PUBLIC_PLATFORM_WHATSAPP_NUMBER || "2348000000000";
                const cleanPlatformNumber = platformNumber.replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${cleanPlatformNumber}?text=Hi, I want to confirm my lesson. My booking reference is ${bookingRef}`, '_blank');
              }}
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white rounded-full font-body text-sm font-semibold hover:opacity-90 transition-opacity shadow-xs mb-4"
            >
              <HugeIcon name="comment" size={20} />
              <span>Verify via WhatsApp</span>
            </button>
            <p className="font-body text-xs text-text-secondary text-center">
              We&apos;ll review your information and verify your identity on WhatsApp. Once verified, you&apos;ll receive a Paystack link to confirm your slot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
