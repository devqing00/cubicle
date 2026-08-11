"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HugeIcon from "@/components/ui/HugeIcon";

interface Booking {
  id: string;
  studentId: string;
  studentName?: string;
  reference: string;
  tier: string;
  status: string;
  createdAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  recordingUrl?: string;
  tutorNotes?: string;
}

export default function HistoryPage() {
  const { userData, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecordingBooking, setSelectedRecordingBooking] = useState<Booking | null>(null);
  const [recordingLinkInput, setRecordingLinkInput] = useState("");
  const [savingRecording, setSavingRecording] = useState(false);

  useEffect(() => {
    if (!userData) return;

    let q;
    if (userData.role === "tutor") {
      q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    } else {
      q = query(
        collection(db, "bookings"),
        where("studentId", "==", userData.uid)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      
      // Sort client-side
      fetchedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBookings(fetchedBookings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  const handleSaveRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordingBooking || !recordingLinkInput.trim()) return;

    setSavingRecording(true);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const bookingRef = doc(db, "bookings", selectedRecordingBooking.id);
      await updateDoc(bookingRef, {
        recordingUrl: recordingLinkInput.trim(),
        status: "completed",
        completedAt: new Date().toISOString(),
      });

      const { sendAppNotification } = await import("@/lib/notifications");
      await sendAppNotification({
        userId: selectedRecordingBooking.studentId,
        title: "Class Recording Available",
        message: `Your instructor has uploaded the lesson recording for your ${selectedRecordingBooking.tier} session (Ref: ${selectedRecordingBooking.reference}).`,
        type: "booking",
        link: "/dashboard/history",
      });

      const { toast } = await import("sonner");
      toast.success("Recording link attached and student notified!");
      setSelectedRecordingBooking(null);
      setRecordingLinkInput("");
    } catch (err) {
      console.error("Failed to save recording:", err);
      const { toast } = await import("sonner");
      toast.error("Failed to save recording link.");
    } finally {
      setSavingRecording(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading history...</span>
        </div>
      </div>
    );
  }

  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled" || b.status === "confirmed");

  return (
    <div className="w-full">
      <div className="mb-8 pb-6 border-b border-border-light">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">Lesson History & Recordings</h1>
        <p className="font-body text-xs md:text-sm text-text-secondary mt-1">Review past sessions, access Google Drive recordings, and archive lesson logs.</p>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-border-light shadow-xs min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pastBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border-light text-text-secondary">
              <HugeIcon name="legal" size={24} />
            </div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">No past lessons</h3>
            <p className="font-body text-xs text-text-secondary">Completed and recorded lessons will appear here.</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="border-b border-border-light text-text-secondary uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="pb-3 font-semibold">Date & Time</th>
                    {userData?.role === "tutor" && <th className="pb-3 font-semibold">Student</th>}
                    <th className="pb-3 font-semibold">Tier</th>
                    <th className="pb-3 font-semibold">Reference</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Recording / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light/60">
                  {pastBookings.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-surface-near-white/60 transition-colors">
                      <td className="py-4 text-text-primary font-medium">
                        {lesson.scheduledDate ? `${lesson.scheduledDate} ${lesson.scheduledTime || ""}` : new Date(lesson.createdAt).toLocaleDateString()}
                      </td>
                      {userData?.role === "tutor" && (
                        <td className="py-4 text-text-primary font-semibold">
                          {lesson.studentName || lesson.studentId?.substring(0, 8)}
                        </td>
                      )}
                      <td className="py-4 text-text-primary capitalize font-medium">
                        {lesson.tier} Tier
                      </td>
                      <td className="py-4 text-text-secondary font-mono font-bold">
                        {lesson.reference || "N/A"}
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                          lesson.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : lesson.status === "cancelled"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {lesson.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {lesson.recordingUrl ? (
                          <a
                            href={lesson.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-accent-blue/10 hover:bg-accent-blue text-accent-blue hover:text-white rounded-full text-[11px] font-bold transition-all inline-flex items-center gap-1.5"
                          >
                            <HugeIcon name="video" size={13} />
                            <span>Watch Recording</span>
                          </a>
                        ) : userData?.role === "tutor" ? (
                          <button
                            onClick={() => {
                              setSelectedRecordingBooking(lesson);
                              setRecordingLinkInput(lesson.recordingUrl || "");
                            }}
                            className="px-3 py-1.5 bg-surface-muted hover:bg-surface-near-white border border-border-light text-text-primary rounded-full text-[11px] font-semibold transition-colors"
                          >
                            + Attach Recording
                          </button>
                        ) : (
                          <span className="text-text-subtle text-[11px]">No recording attached</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Attach Recording Modal for Tutors */}
      {selectedRecordingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSaveRecording}
            className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-border-light shadow-2xl space-y-4 font-body"
          >
            <div className="flex items-center justify-between border-b border-border-light pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Attach Lesson Recording
                </h3>
                <p className="text-xs text-text-secondary">
                  Ref: {selectedRecordingBooking.reference} • {selectedRecordingBooking.studentName || "Student"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecordingBooking(null)}
                className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
              >
                <HugeIcon name="cancel" size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Google Drive / Cloud Recording URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={recordingLinkInput}
                  onChange={(e) => setRecordingLinkInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
                />
                <p className="text-[10px] text-text-subtle mt-1">
                  Google Meet auto-saves recordings into your Google Drive &apos;Meet Recordings&apos; folder. Paste the sharing link here.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
              <button
                type="button"
                onClick={() => setSelectedRecordingBooking(null)}
                className="px-4 py-2 rounded-full border border-border-light text-xs font-semibold text-text-secondary hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingRecording}
                className="px-5 py-2 rounded-full bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
              >
                {savingRecording ? "Saving..." : "Save & Notify Student"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
