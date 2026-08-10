"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OnboardingPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData?.onboardingComplete || userData?.role === "tutor") {
        router.push("/dashboard");
      }
    }
  }, [user, userData, loading, router]);

  if (loading || !user || !userData) {
    return <div className="min-h-screen flex items-center justify-center font-body bg-surface-base">Loading...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const dataToUpdate: Record<string, unknown> = {
        firstName,
        age: Number(age),
        whatsappNumber,
        learningGoals,
        onboardingComplete: true
      };

      if (Number(age) < 18) {
        dataToUpdate.guardianName = guardianName;
        dataToUpdate.guardianContact = guardianContact;
      }

      await updateDoc(doc(db, "users", user.uid), dataToUpdate);

      // Force a reload so AuthContext picks up the new document fields
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/dashboard");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save details.";
      setError(errorMessage);
      setSaving(false);
    }
  };



  return (
    <div className="bg-white p-8 rounded-3xl shadow-brutal border border-border-warm relative z-10">
      <h1 className="font-heading text-3xl font-bold text-dark-charcoal mb-2">Complete your profile</h1>
      <p className="font-body text-[15px] text-mid-gray-brown mb-8">
        We need a few more details to set up your student account.
      </p>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-blue/20 focus:outline-none focus:ring-2 focus:ring-chip-blue font-body text-dark-charcoal"
              placeholder="Jane"
              required
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-blue/20 focus:outline-none focus:ring-2 focus:ring-chip-blue font-body text-dark-charcoal"
              placeholder="e.g. 16"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">WhatsApp Phone Number</label>
          <input
            type="tel"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-blue/20 focus:outline-none focus:ring-2 focus:ring-chip-blue font-body text-dark-charcoal"
            placeholder="+44 7700 900077"
            required
          />
          <p className="text-xs text-mid-gray-brown mt-1">Required for booking verification and lesson links.</p>
        </div>

        {typeof age === "number" && age < 18 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-dark-charcoal text-sm">Guardian Details Required</h3>
            <div>
              <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">Guardian Name</label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-chip-blue font-body text-dark-charcoal"
                required
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">Guardian Contact Number</label>
              <input
                type="tel"
                value={guardianContact}
                onChange={(e) => setGuardianContact(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-chip-blue font-body text-dark-charcoal"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">Learning Goals</label>
          <textarea
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            rows={3}
            className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-blue/20 focus:outline-none focus:ring-2 focus:ring-chip-blue font-body text-dark-charcoal"
            placeholder="What do you want to achieve from your lessons?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-4 py-4 bg-oboe-black text-white rounded-full font-body text-[15px] font-medium hover:bg-chip-blue hover:text-oboe-black transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Complete Setup"}
        </button>
      </form>
    </div>
  );
}
