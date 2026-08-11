"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import HugeIcon from "@/components/ui/HugeIcon";
import { toast } from "sonner";
import { getUserLocalTimeZone } from "@/lib/timezone";
import PhoneInput from "@/components/ui/PhoneInput";

export default function SettingsPage() {
  const { user, userData, loading } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [learningGoal, setLearningGoal] = useState("");
  const [timeZone, setTimeZone] = useState("Africa/Lagos");
  const [tutorMeetLink, setTutorMeetLink] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || userData.fullName || user?.displayName || "");
      setPhoneNumber(userData.whatsapp || userData.whatsappNumber || userData.phoneNumber || "");
      setTargetLanguage(userData.targetLanguage || "Spanish");
      setExperienceLevel(userData.experienceLevel || userData.level || "Beginner (A1)");
      setLearningGoal(userData.learningGoal || userData.learningGoals || "");
      setTimeZone(userData.timeZone || getUserLocalTimeZone());
      setTutorMeetLink(userData.meetLink || "");
    }
  }, [userData, user]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading your settings...</span>
        </div>
      </div>
    );
  }

  const isTutor = userData?.role === "tutor";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        fullName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsapp: phoneNumber.trim(),
        whatsappNumber: phoneNumber.trim(),
        targetLanguage,
        experienceLevel,
        level: experienceLevel,
        learningGoal: learningGoal.trim(),
        learningGoals: learningGoal.trim(),
        timeZone,
        meetLink: tutorMeetLink.trim(),
        emailNotifications,
        whatsappNotifications,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Profile preferences saved successfully!");
    } catch (err: unknown) {
      console.error("Failed to update profile settings:", err);
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-body">
      {/* Header */}
      <div>
        <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-2 inline-block">
          Account & Preferences
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Profile Settings
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-secondary mt-1">
          Manage your personal details, language study track, contact information, and time zone.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-border-light shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border-light pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
              <HugeIcon name="users" size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-text-primary">Personal Information</h3>
              <p className="text-xs text-text-secondary">Your identity across Cubicle sessions and chats.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-text-primary mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Maria Gonzalez"
                className="w-full px-4 py-3 rounded-2xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1.5">Email Address (Auth ID)</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-3 rounded-2xl border border-border-light bg-surface-muted/60 text-xs font-body text-text-subtle cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1.5">WhatsApp / Mobile Number</label>
              <PhoneInput
                id="settings-phone"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
              <p className="text-[10px] text-text-subtle mt-1">Used for optional lesson alerts and tutor contact.</p>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1.5">Preferred Time Zone</label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
              >
                <option value="Africa/Lagos">Africa/Lagos (WAT • UTC+1)</option>
                <option value="Europe/London">Europe/London (GMT/BST • UTC+0/+1)</option>
                <option value="Europe/Paris">Europe/Paris (CET • UTC+1)</option>
                <option value="America/New_York">America/New_York (EST • UTC-5)</option>
                <option value="America/Chicago">America/Chicago (CST • UTC-6)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST • UTC-8)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST • UTC+4)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Meeting Room Configuration (For Tutors) */}
        {isTutor && (
          <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-border-light shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-border-light pb-4">
              <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                <HugeIcon name="video" size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text-primary">Virtual Classroom & Google Meet</h3>
                <p className="text-xs text-text-secondary">Connected Cal.com API v2 automatically provisions real Google Meet rooms for every student session.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1.5">Dedicated Google Meet Room URL (Optional Fallback)</label>
                <input
                  type="url"
                  value={tutorMeetLink}
                  onChange={(e) => setTutorMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  className="w-full px-4 py-3 rounded-2xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
                />
                <p className="text-[10px] text-text-subtle mt-1.5">
                  Leave blank to auto-generate unique Google Meet rooms via Cal.com, or paste your permanent personal Google Meet link.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Learning Program Preferences (For Students) */}
        {!isTutor && (
          <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-border-light shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-border-light pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <HugeIcon name="sparkles" size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text-primary">Learning Track & Goals</h3>
                <p className="text-xs text-text-secondary">Customize your curriculum focus and proficiency level.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1.5">Target Language</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
                >
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="English">Business English</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Mandarin">Mandarin (中文)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1.5">Current Proficiency (CEFR)</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
                >
                  <option value="Beginner">Beginner (A1 - Just starting)</option>
                  <option value="Elementary">Elementary (A2 - Basic phrases)</option>
                  <option value="Intermediate">Intermediate (B1 - Conversational)</option>
                  <option value="Upper Intermediate">Upper Intermediate (B2 - Fluent)</option>
                  <option value="Advanced">Advanced (C1-C2 - Mastery)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-text-primary mb-1.5">Primary Learning Objective</label>
                <input
                  type="text"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="e.g. Pass DELE B2 Exam for university admission or Prepare for medical residency in Spain"
                  className="w-full px-4 py-3 rounded-2xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-accent-blue text-white rounded-full font-body text-xs font-semibold hover:bg-accent-blue-hover transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2"
          >
            <HugeIcon name="check" size={16} />
            <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
