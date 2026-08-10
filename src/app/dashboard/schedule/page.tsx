"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CalendarIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import Link from "next/link";

interface Booking {
  id: string;
  studentId: string;
  reference: string;
  tier: string;
  status: string;
  createdAt: string;
  videoCallUrl?: string;
}

export default function SchedulePage() {
  const { userData, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"booking" | "block">("booking");
  const [modalData, setModalData] = useState({ date: "", time: "", studentEmail: "", tier: "standard", reason: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app, we'd ping Cal.com or create the document fully here
      await fetch(`/api/tutor/bookings/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: modalType, ...modalData })
      });
      toast.success(modalType === "booking" ? "Manual booking created!" : "Time block added successfully!");
      setIsModalOpen(false);
      setModalData({ date: "", time: "", studentEmail: "", tier: "standard", reason: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/tutor/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the booking.");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (!userData) return;

    let q;
    if (userData.role === "tutor") {
      q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    } else {
      q = query(
        collection(db, "bookings"),
        where("studentId", "==", userData.uid),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      
      setBookings(fetchedBookings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  if (authLoading) return <div className="animate-pulse">Loading schedule...</div>;

  const upcomingLessons = bookings.filter(l => l.status === "confirmed");
  const pendingDrafts = bookings.filter(l => l.status === "pending_wa" || l.status === "pending_payment");

  if (userData?.role === "tutor") {
    return (
      <div className="w-full">
        <h1 className="font-heading text-4xl font-bold text-oboe-black mb-8">My Schedule</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Schedule */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-2xl font-bold text-oboe-black">Upcoming Lessons</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-cta-yellow border border-oboe-black rounded-full text-xs font-bold uppercase tracking-wider text-oboe-black hover:bg-chip-yellow transition-colors"
              >
                + Create Booking
              </button>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm min-h-[350px] flex items-center justify-center">
              {loading ? (
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-cta-yellow border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : upcomingLessons.length === 0 ? (
                <div className="text-center">
                  <h3 className="font-heading text-lg font-semibold text-oboe-black mb-1">No classes scheduled</h3>
                  <p className="font-body text-sm text-mid-gray-brown">You have no upcoming sessions right now.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full h-full justify-start items-stretch">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="bg-surface-base p-4 rounded-xl border border-border-warm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-lg border border-border-warm">
                          <CalendarIcon className="w-5 h-5 text-dark-charcoal" />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-oboe-black">{lesson.tier} Tier</h4>
                          <p className="font-body text-xs text-mid-gray-brown">
                            {new Date(lesson.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.videoCallUrl ? (
                          <a 
                            href={lesson.videoCallUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-cta-yellow border border-oboe-black rounded-full text-xs font-medium text-oboe-black hover:bg-chip-yellow transition-colors"
                          >
                            Join Call
                          </a>
                        ) : (
                          <button 
                            onClick={() => toast.info("Meeting links will be generated closer to the session.")}
                            className="px-3 py-1.5 bg-white border border-border-warm rounded-full text-xs font-medium text-mid-gray-brown cursor-not-allowed"
                          >
                            Join (Pending)
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateStatus(lesson.id, "cancelled")}
                          disabled={actionLoading === lesson.id}
                          className="px-3 py-1.5 bg-chip-pink/30 border border-chip-pink text-dark-charcoal rounded-full text-xs font-medium hover:bg-chip-pink transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(lesson.id, "completed")}
                          disabled={actionLoading === lesson.id}
                          className="px-3 py-1.5 bg-chip-green/30 border border-chip-green text-dark-charcoal rounded-full text-xs font-medium hover:bg-chip-green transition-colors disabled:opacity-50"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Drafts */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-oboe-black mb-6">Pending Drafts</h2>
            <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm min-h-[350px] flex items-center justify-center">
              {loading ? (
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-cta-yellow border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : pendingDrafts.length === 0 ? (
                <div className="text-center">
                  <h3 className="font-heading text-lg font-semibold text-oboe-black mb-1">No pending drafts</h3>
                  <p className="font-body text-sm text-mid-gray-brown">All recent bookings have been paid and confirmed.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full h-full justify-start items-stretch">
                  {pendingDrafts.map((lesson) => (
                    <div key={lesson.id} className="bg-surface-base p-4 rounded-xl border border-border-warm flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading font-semibold text-oboe-black">Student ID: {lesson.studentId?.substring(0,6) || "Unknown"}...</h4>
                          <p className="font-body text-xs text-mid-gray-brown">
                            {lesson.tier} Tier
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                          lesson.status === "pending_wa" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {lesson.status === "pending_wa" ? "Awaiting WA" : "Awaiting Payment"}
                        </span>
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <p className="font-body text-xs text-dark-charcoal">Ref: <strong>{lesson.reference || "N/A"}</strong></p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(lesson.id, "cancelled")}
                            disabled={actionLoading === lesson.id}
                            className="text-xs font-medium text-mid-gray-brown hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(lesson.id, "confirmed")}
                            disabled={actionLoading === lesson.id}
                            className="px-3 py-1 bg-oboe-black text-white rounded-full text-xs font-medium hover:bg-dark-charcoal transition-colors disabled:opacity-50"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manual Booking Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-[90vw] sm:w-[500px] max-w-full shrink-0 p-8 shadow-2xl relative overflow-hidden">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-mid-gray-brown hover:text-oboe-black transition-colors"
              >
                ✕
              </button>
              
              <h2 className="font-heading text-2xl font-bold text-oboe-black mb-6">
                Manage Schedule
              </h2>

              <div className="flex gap-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setModalType("booking")}
                  className={`flex-1 py-2 font-body text-sm font-semibold rounded-xl transition-colors ${modalType === "booking" ? "bg-oboe-black text-white" : "bg-surface-base text-mid-gray-brown hover:bg-gray-100"}`}
                >
                  Manual Booking
                </button>
                <button 
                  type="button"
                  onClick={() => setModalType("block")}
                  className={`flex-1 py-2 font-body text-sm font-semibold rounded-xl transition-colors ${modalType === "block" ? "bg-chip-pink text-dark-charcoal" : "bg-surface-base text-mid-gray-brown hover:bg-gray-100"}`}
                >
                  Block Time
                </button>
              </div>

              <form onSubmit={handleManualBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs font-bold text-dark-charcoal mb-1 uppercase tracking-wider">Date</label>
                    <input 
                      type="date" 
                      required
                      value={modalData.date}
                      onChange={e => setModalData({...modalData, date: e.target.value})}
                      className="w-full p-3 bg-surface-base border border-border-warm rounded-xl font-body text-sm text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-bold text-dark-charcoal mb-1 uppercase tracking-wider">Time</label>
                    <input 
                      type="time" 
                      required
                      value={modalData.time}
                      onChange={e => setModalData({...modalData, time: e.target.value})}
                      className="w-full p-3 bg-surface-base border border-border-warm rounded-xl font-body text-sm text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
                    />
                  </div>
                </div>

                {modalType === "booking" ? (
                  <>
                    <div>
                      <label className="block font-body text-xs font-bold text-dark-charcoal mb-1 uppercase tracking-wider">Student Email</label>
                      <input 
                        type="email" 
                        required
                        value={modalData.studentEmail}
                        onChange={e => setModalData({...modalData, studentEmail: e.target.value})}
                        className="w-full p-3 bg-surface-base border border-border-warm rounded-xl font-body text-sm text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
                        placeholder="student@example.com"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-bold text-dark-charcoal mb-1 uppercase tracking-wider">Tier</label>
                      <select 
                        value={modalData.tier}
                        onChange={e => setModalData({...modalData, tier: e.target.value})}
                        className="w-full p-3 bg-surface-base border border-border-warm rounded-xl font-body text-sm text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
                      >
                        <option value="trial">Free Trial</option>
                        <option value="standard">Standard (60m)</option>
                        <option value="intensive">Intensive (90m)</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block font-body text-xs font-bold text-dark-charcoal mb-1 uppercase tracking-wider">Reason (Optional)</label>
                    <input 
                      type="text" 
                      value={modalData.reason}
                      onChange={e => setModalData({...modalData, reason: e.target.value})}
                      className="w-full p-3 bg-surface-base border border-border-warm rounded-xl font-body text-sm text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
                      placeholder="e.g. Doctor's appointment"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-cta-yellow text-oboe-black rounded-xl font-body font-bold border border-oboe-black hover:bg-chip-yellow transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : modalType === "booking" ? "Create Booking" : "Block Time"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Student Schedule View
  const activeBookings = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled");

  return (
    <div className="w-full">
      <h1 className="font-heading text-4xl font-bold text-oboe-black mb-8">Upcoming Lessons</h1>
      
      {loading ? (
        <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm min-h-[300px] flex items-center justify-center">
           <div className="animate-pulse flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-cta-yellow border-t-transparent rounded-full animate-spin"></div>
             <p className="font-body text-mid-gray-brown">Loading lessons...</p>
           </div>
        </div>
      ) : activeBookings.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-surface-base rounded-full flex items-center justify-center mx-auto mb-4 border border-border-warm">
              <CalendarIcon className="w-8 h-8 text-mid-gray-brown" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-oboe-black mb-2">No upcoming lessons</h3>
            <p className="font-body text-mid-gray-brown mb-6 max-w-sm mx-auto">
              You haven&apos;t scheduled any tutoring sessions yet. Book your first lesson to get started.
            </p>
            <Link href="/dashboard/book" className="inline-block px-6 py-2.5 bg-cta-yellow text-oboe-black rounded-full font-body font-medium border border-oboe-black hover:bg-chip-yellow transition-colors">
              Book a Lesson
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeBookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-2xl border border-border-warm shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-highlight-green rounded-xl">
                  <AcademicCapIcon className="w-6 h-6 text-dark-charcoal" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-oboe-black">{booking.tier} Tier Lesson</h3>
                  <p className="font-body text-sm text-mid-gray-brown">
                    {new Date(booking.createdAt).toLocaleDateString()} • {booking.status.replace("_", " ")}
                  </p>
                </div>
              </div>
              {booking.status === "confirmed" ? (
                booking.videoCallUrl ? (
                  <a 
                    href={booking.videoCallUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cta-yellow border border-oboe-black rounded-full text-sm font-medium text-oboe-black hover:bg-chip-yellow transition-colors"
                  >
                    Join Call
                  </a>
                ) : (
                  <button 
                    onClick={() => toast.info("Meeting links will be generated closer to the session.")}
                    className="px-4 py-2 bg-surface-base border border-border-warm rounded-full text-sm font-medium text-mid-gray-brown cursor-not-allowed"
                  >
                    Join Call (Pending)
                  </button>
                )
              ) : (
                <Link href="/dashboard/book" className="inline-block px-4 py-2 bg-surface-base border border-border-warm rounded-full text-sm font-medium hover:bg-white transition-colors">
                  Resume Booking
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
