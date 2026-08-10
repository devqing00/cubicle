"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import HugeIcon from "@/components/ui/HugeIcon";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, refreshUserData } = useAuth();
  
  const [age, setAge] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!age || !learningGoals) {
      toast.error("Please complete both fields to continue.");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        age: parseInt(age),
        learningGoals,
        onboardingComplete: true,
        updatedAt: new Date().toISOString()
      });
      
      await refreshUserData();
      toast.success("Profile setup complete! Welcome to Cubicle.");
      router.push("/dashboard/book");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-8 sm:p-10 rounded-[28px] shadow-sm border border-border-light relative z-10 space-y-6">
      
      {/* Icon Badge */}
      <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl border border-accent-blue/20 flex items-center justify-center text-accent-blue">
        <HugeIcon name="sparkles" size={24} />
      </div>

      {/* Header */}
      <div>
        <span className="px-3 py-1 bg-surface-muted text-text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-border-light mb-3 inline-block">
          Step 1 of 1 • Personalization
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-1">
          Welcome to Cubicle!
        </h1>
        <p className="font-body text-xs text-text-secondary leading-relaxed">
          Tell us a little about your learning goals so your instructor can tailor your 1-on-1 sessions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Onboarding profile setup form">
        <div>
          <label htmlFor="onboarding-age" className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Your Age
          </label>
          <input 
            id="onboarding-age"
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary placeholder:text-text-subtle transition-colors focus:border-accent-blue"
            placeholder="e.g. 24"
            min="1"
            max="120"
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="onboarding-goals" className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            What are your learning goals?
          </label>
          <textarea 
            id="onboarding-goals"
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary placeholder:text-text-subtle transition-colors focus:border-accent-blue min-h-[110px] resize-none"
            placeholder="e.g. Preparing for a Spanish job interview in Madrid, focusing on conversational fluency..."
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-xs"
        >
          {loading ? "Saving Profile..." : "Complete Setup & Book Trial"}
        </button>
      </form>
    </div>
  );
}
