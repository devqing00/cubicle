"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Cal, { getCalApi } from "@calcom/embed-react";
import { toast } from "sonner";
import { addDoc, collection, query, where, getDocs, limit, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BookingPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [selectedTier, setSelectedTier] = useState<"trial" | "standard" | "intensive" | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"tier_selection" | "calendar" | "whatsapp_verification">("tier_selection");
  const [hasClaimedTrial, setHasClaimedTrial] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/dashboard/book");
      } else if (userData && !userData.onboardingComplete && userData.role !== "tutor") {
        router.push("/onboarding");
      }
    }
  }, [user, userData, loading, router]);

  // FIX 1: Restore state on mount if they refreshed the page
  useEffect(() => {
    const checkExistingDraft = async () => {
      if (user && bookingStatus === "tier_selection") {
        try {
          const q = query(
            collection(db, "bookings"),
            where("studentId", "==", user.uid),
            where("status", "==", "pending_wa"),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const existingDoc = snapshot.docs[0].data();
            setBookingRef(existingDoc.reference);
            setBookingStatus("whatsapp_verification");
          }

          // Check if they already claimed a trial
          const trialQ = query(
            collection(db, "bookings"),
            where("studentId", "==", user.uid),
            where("tier", "==", "trial"),
            limit(1)
          );
          const trialSnapshot = await getDocs(trialQ);
          if (!trialSnapshot.empty) {
            setHasClaimedTrial(true);
          }
        } catch (error) {
          console.error("Error checking for existing drafts or trials:", error);
        }
      }
    };
    checkExistingDraft();
  }, [user, bookingStatus]);

  const handleCalEmbedLoad = useCallback(async () => {
    const cal = await getCalApi();
    cal("on", {
      action: "bookingSuccessful",
      callback: async (e) => {
        // FIX 2: Cryptographically secure reference generation
        const array = new Uint8Array(3); // 3 bytes = 6 hex chars
        window.crypto.getRandomValues(array);
        const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        const ref = `CUB-${hex}`;
        
        setBookingRef(ref);
        setBookingStatus("whatsapp_verification");
        
        // Note: The Cal.com webhook will also ping our backend, but we create the draft record here first
        try {
          await addDoc(collection(db, "bookings"), {
            studentId: user?.uid,
            reference: ref,
            tier: selectedTier,
            calcomBookingId: (e.detail.data as any).uid || "manual", // Provided by Cal.com success event
            status: "pending_wa",
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Failed to create draft booking", error);
          toast.error("Failed to book session. If this is a free trial, you may have already claimed one.");
          setBookingStatus("tier_selection");
        }
      }
    });
  }, [selectedTier, user]);

  useEffect(() => {
    if (bookingStatus === "calendar") {
      handleCalEmbedLoad();
    }
  }, [bookingStatus, handleCalEmbedLoad]);

  if (loading || !user || !userData) {
    return <div className="min-h-screen bg-surface-base flex justify-center items-center">Loading...</div>;
  }

  // NOTE: Replace 'devqing00/cubicle' with the actual Cal.com event type URL for the instructor
  const calcomLink = "devqing00/cubicle"; 

  return (
    <div className="min-h-screen bg-surface-base pt-32 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-mid-gray-brown hover:text-dark-charcoal font-body text-sm font-medium transition-colors mb-8">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {bookingStatus === "tier_selection" && (
          <div>
            <h1 className="font-heading text-4xl font-bold text-dark-charcoal mb-4">Select your lesson type</h1>
            <p className="font-body text-mid-gray-brown mb-12">Choose the session that fits your goals. You&apos;ll pick a time on the next step.</p>
            
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
                  className={`bg-white p-8 rounded-3xl border border-border-warm shadow-sm transition-all text-left flex flex-col items-start gap-4 ${
                    isDisabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:shadow-md cursor-pointer"
                  }`}
                >
                  <span className="inline-block px-3 py-1 bg-surface-base rounded-full text-xs font-semibold uppercase tracking-wider text-mid-gray-brown">
                    {isDisabled ? "Already Claimed" : tier.desc}
                  </span>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-dark-charcoal">{tier.name}</h3>
                    <p className="font-body text-lg text-mid-gray-brown mt-1">{tier.price}</p>
                  </div>
                  <div className="mt-auto w-full pt-4 border-t border-border-warm">
                    <span className={`font-medium font-body ${isDisabled ? "text-mid-gray-brown" : "text-cta-yellow hover:underline"}`}>
                      {isDisabled ? "Unavailable" : "Select \u2192"}
                    </span>
                  </div>
                </button>
              )})}
            </div>
          </div>
        )}

        {bookingStatus === "calendar" && (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="font-heading text-3xl font-bold text-dark-charcoal">Pick a time</h1>
                <p className="font-body text-mid-gray-brown">Select a slot for your {selectedTier} lesson.</p>
              </div>
              <button 
                onClick={() => setBookingStatus("tier_selection")}
                className="text-sm font-medium text-mid-gray-brown hover:text-dark-charcoal underline"
              >
                Change tier
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-border-warm shadow-brutal overflow-hidden">
              <Cal
                calLink={calcomLink}
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view" }}
              />
            </div>
          </div>
        )}

        {bookingStatus === "whatsapp_verification" && (
          <div className="bg-white p-12 rounded-3xl border border-border-warm shadow-brutal text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-dark-charcoal mb-4">Almost there!</h2>
            <p className="font-body text-mid-gray-brown mb-8 text-lg">
              To prevent spam and ensure you get a real person, we require a quick WhatsApp verification before payment.
            </p>
            
            <div className="bg-surface-base p-6 rounded-2xl border border-border-warm mb-8">
              <p className="font-body text-sm text-mid-gray-brown mb-2 uppercase tracking-wider font-semibold">Your Booking Reference</p>
              <p className="font-heading text-4xl font-bold text-oboe-black tracking-widest">{bookingRef}</p>
            </div>

            <div className="text-left mb-6">
              <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">Your WhatsApp Number (for updates)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234..."
                className="w-full px-4 py-3 rounded-xl border border-border-warm bg-surface-base focus:outline-none focus:ring-2 focus:ring-chip-blue focus:border-chip-blue font-body"
              />
            </div>

            <button 
              onClick={async () => {
                if (phone) {
                  try {
                    // Update the booking document with the phone number
                    const q = query(collection(db, "bookings"), where("reference", "==", bookingRef));
                    const snapshot = await getDocs(q);
                    if (!snapshot.empty) {
                      const docRef = doc(db, "bookings", snapshot.docs[0].id);
                      await updateDoc(docRef, { studentWhatsApp: phone });
                    }
                  } catch (e) {}
                }
                window.open(`https://wa.me/2347000000000?text=Hi, I want to confirm my lesson. My booking reference is ${bookingRef}`, '_blank');
              }}
              className="inline-block w-full py-4 bg-[#25D366] text-white rounded-full font-body text-[17px] font-semibold hover:opacity-90 transition-opacity shadow-sm mb-4"
            >
              Verify via WhatsApp
            </button>
            <p className="font-body text-mid-gray-brown text-center mb-8">
              We&apos;ll review your information and verify your identity on WhatsApp. Once verified, you&apos;ll receive a payment link to confirm your slot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
