"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import HugeIcon from "@/components/ui/HugeIcon";
import PhoneInput from "@/components/ui/PhoneInput";
import Logo from "@/components/ui/Logo";

const LANGUAGES = [
  "Spanish", "French", "German", "Italian",
  "Mandarin Chinese", "Japanese", "Portuguese",
  "Russian", "English", "General / Conversational"
];

const LEVELS = [
  "Beginner (A1)", "Elementary (A2)", "Intermediate (B1)",
  "Upper-Intermediate (B2)", "Advanced (C1)", "Fluent / Native (C2)"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, refreshUserData } = useAuth();
  
  React.useEffect(() => {
    if (userData?.role === "tutor" || userData?.onboardingComplete) {
      router.push("/dashboard");
    }
  }, [userData, router]);

  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [experienceLevel, setExperienceLevel] = useState("Beginner (A1)");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!age || !learningGoals || !phoneNumber) {
      toast.error("Please fill in all fields to complete your profile setup.");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        targetLanguage,
        experienceLevel,
        level: experienceLevel,
        age: parseInt(age, 10),
        whatsapp: phoneNumber.trim(),
        whatsappNumber: phoneNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        learningGoal: learningGoals.trim(),
        learningGoals: learningGoals.trim(),
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
      
      {/* Logo Badge */}
      <div className="mb-2">
        <Logo variant="blue" size={28} />
      </div>

      {/* Header */}
      <div>
        <span className="px-3 py-1 bg-surface-muted text-text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-border-light mb-3 inline-block">
          Personalize Your Learning Experience
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-1">
          Welcome to Cubicle!
        </h1>
        <p className="font-body text-xs text-text-secondary leading-relaxed">
          Tell us about your target language, proficiency level, and goals so your instructor can tailor your 1-on-1 sessions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs" aria-label="Onboarding profile setup form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="onboarding-lang" className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Target Language
            </label>
            <select
              id="onboarding-lang"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="onboarding-level" className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Proficiency Level
            </label>
            <select
              id="onboarding-level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue transition-colors"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="onboarding-age" className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Your Age
          </label>
          <input 
            id="onboarding-age"
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary placeholder:text-text-subtle focus:border-accent-blue transition-colors"
            placeholder="e.g. 24"
            min="1"
            max="120"
            required
          />
        </div>

        <div>
          <label htmlFor="onboarding-phone" className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            WhatsApp / Mobile Number
          </label>
          <PhoneInput 
            id="onboarding-phone"
            value={phoneNumber}
            onChange={setPhoneNumber}
            required
          />
        </div>

        <div>
          <label htmlFor="onboarding-goals" className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            What are your learning goals & pace?
          </label>
          <textarea 
            id="onboarding-goals"
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary placeholder:text-text-subtle focus:border-accent-blue min-h-[100px] resize-none"
            placeholder="e.g. Preparing for a DELE exam in Madrid, focusing on conversational fluency and business vocabulary..."
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-xs"
        >
          {loading ? "Saving Profile..." : "Complete Setup & Book Session"}
        </button>
      </form>
    </div>
  );
}
