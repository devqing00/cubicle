"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HugeIcon from "@/components/ui/HugeIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { toast } from "sonner";
import Link from "next/link";
import { formatDualTime } from "@/lib/timezone";
import { sendAppNotification } from "@/lib/notifications";

function formatYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface Booking {
  id: string;
  studentId: string;
  studentName?: string;
  reference: string;
  tier: string;
  scheduledDate?: string;
  scheduledTime?: string;
  formattedSchedule?: string;
  status: string;
  createdAt: string;
  meetLink?: string;
  meetingCode?: string;
  videoCallUrl?: string;
}

export default function SchedulePage() {
  const { userData, user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00");
  const [rescheduling, setRescheduling] = useState(false);

  // Manual Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"booking" | "block">("booking");
  const [modalData, setModalData] = useState({ date: "", time: "", studentEmail: "", tier: "standard", reason: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation Modal State
  const [confirmModalData, setConfirmModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: "danger" | "primary" | "warning";
    iconName: "alert" | "shield" | "sparkles";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    variant: "primary",
    iconName: "alert",
    onConfirm: () => {},
  });

  const handleManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
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

  const executeStatusUpdate = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const isTutor = userData?.role === "tutor";
      let res: Response;

      if (newStatus === "cancelled" && !isTutor) {
        // Student cancelling their own booking via student cancellation API
        res = await fetch(`/api/student/bookings/${id}/cancel`, {
          method: "DELETE",
        });
      } else {
        // Tutor status update
        res = await fetch(`/api/tutor/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update status");
      }

      toast.success(`Booking ${newStatus} successfully!`);
      setConfirmModalData(prev => ({ ...prev, isOpen: false }));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "An error occurred while updating the booking.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenReschedule = (booking: Booking) => {
    // Check 24-hour policy
    const sessionTimeStr = booking.scheduledDate
      ? `${booking.scheduledDate}T${booking.scheduledTime || "10:00"}:00`
      : booking.createdAt;
    const sessionTime = new Date(sessionTimeStr).getTime();
    const hoursLeft = (sessionTime - Date.now()) / (1000 * 60 * 60);

    if (hoursLeft < 24) {
      toast.error(
        "Notice: Changes within 24 hours cannot be self-rescheduled. Please contact your instructor directly via In-App Chat or WhatsApp.",
        { duration: 6000 }
      );
      return;
    }

    setRescheduleBooking(booking);
    setNewDate(booking.scheduledDate || formatYMD(new Date(Date.now() + 86400000 * 2)));
    setNewTime(booking.scheduledTime || "10:00");
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking || !newDate || !newTime) return;

    setRescheduling(true);
    try {
      const formattedSchedule = `${newDate} at ${newTime}`;
      const bookingRef = doc(db, "bookings", rescheduleBooking.id);

      await updateDoc(bookingRef, {
        scheduledDate: newDate,
        scheduledTime: newTime,
        formattedSchedule,
        rescheduledAt: new Date().toISOString(),
      });

      // Dispatch real-time notification to instructor
      await sendAppNotification({
        userId: "tutor_cubicle",
        title: `Session Rescheduled: ${rescheduleBooking.studentName || "Student"}`,
        message: `${rescheduleBooking.studentName || "Student"} rescheduled their ${rescheduleBooking.tier} lesson (Ref: ${rescheduleBooking.reference}) to ${formattedSchedule}.`,
        type: "booking",
        link: "/dashboard/schedule",
      });

      toast.success(`Lesson successfully rescheduled for ${formattedSchedule}!`);
      setRescheduleBooking(null);
    } catch (err) {
      console.error("Failed to reschedule:", err);
      toast.error("Failed to reschedule lesson. Please try again.");
    } finally {
      setRescheduling(false);
    }
  };

  const promptStatusUpdate = (id: string, newStatus: string, reference: string) => {
    if (newStatus === "cancelled") {
      setConfirmModalData({
        isOpen: true,
        title: "Cancel / Decline Booking?",
        description: `Are you sure you want to cancel this booking (Ref: ${reference})? Under our 24-hour policy, this time slot will be reopened.`,
        confirmText: "Cancel Booking",
        variant: "danger",
        iconName: "alert",
        onConfirm: () => executeStatusUpdate(id, "cancelled"),
      });
    } else if (newStatus === "completed") {
      setConfirmModalData({
        isOpen: true,
        title: "Mark Lesson Completed?",
        description: "Marking this session as completed will update your tutor metrics and trigger post-lesson feedback delivery to the student.",
        confirmText: "Mark Completed",
        variant: "primary",
        iconName: "sparkles",
        onConfirm: () => executeStatusUpdate(id, "completed"),
      });
    } else {
      executeStatusUpdate(id, newStatus);
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

  if (authLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading schedule...</span>
        </div>
      </div>
    );
  }

  const upcomingLessons = bookings.filter(l => l.status === "confirmed" || l.status === "paid");
  const pendingDrafts = bookings.filter(l => l.status === "pending_payment");

  if (userData?.role === "tutor") {
    return (
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-light">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">Master Schedule</h1>
            <p className="font-body text-xs md:text-sm text-text-secondary mt-1">View upcoming sessions and manage student availability.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-text-primary text-white rounded-full text-xs font-semibold hover:bg-black transition-colors flex items-center gap-2"
          >
            <HugeIcon name="sparkles" size={14} className="text-accent-blue" />
            <span>+ Create Booking</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Schedule */}
          <div>
            <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Confirmed Sessions</h2>
            <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs min-h-[350px] flex flex-col justify-start">
              {loading ? (
                <div className="my-auto flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : upcomingLessons.length === 0 ? (
                <div className="my-auto text-center py-10">
                  <HugeIcon name="calendar" size={32} className="text-text-subtle mx-auto mb-3" />
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-1">No classes scheduled</h3>
                  <p className="font-body text-xs text-text-secondary">You have no upcoming sessions right now.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="bg-surface-near-white p-4 rounded-2xl border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-xl border border-border-light flex items-center justify-center text-accent-blue shrink-0">
                          <HugeIcon name="calendar" size={18} />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-xs text-text-primary capitalize">{lesson.tier} Tier</h4>
                          <p className="font-body text-[11px] text-text-secondary">
                            {new Date(lesson.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {lesson.videoCallUrl ? (
                          <a 
                            href={lesson.videoCallUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-accent-blue text-white rounded-full text-xs font-semibold hover:bg-blue-600 transition-colors"
                          >
                            Join Call
                          </a>
                        ) : (
                          <button 
                            onClick={() => toast.info("Meeting links will be generated closer to the session.")}
                            className="px-3 py-1.5 bg-surface-muted border border-border-light rounded-full text-xs font-medium text-text-subtle cursor-not-allowed"
                          >
                            Pending
                          </button>
                        )}
                        <button
                          onClick={() => promptStatusUpdate(lesson.id, "cancelled", lesson.reference)}
                          disabled={actionLoading === lesson.id}
                          className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => promptStatusUpdate(lesson.id, "completed", lesson.reference)}
                          disabled={actionLoading === lesson.id}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
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
            <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Pending Requests</h2>
            <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs min-h-[350px] flex flex-col justify-start">
              {loading ? (
                <div className="my-auto flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : pendingDrafts.length === 0 ? (
                <div className="my-auto text-center py-10">
                  <HugeIcon name="check" size={32} className="text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-1">No pending requests</h3>
                  <p className="font-body text-xs text-text-secondary">All recent bookings have been confirmed.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  {pendingDrafts.map((lesson) => (
                    <div key={lesson.id} className="bg-surface-near-white p-4 rounded-2xl border border-border-light flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading font-bold text-xs text-text-primary">Student: {lesson.studentId?.substring(0,8)}...</h4>
                          <p className="font-body text-[11px] text-text-secondary capitalize">
                            {lesson.tier} Tier Session
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                          Awaiting Payment
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border-light mt-1">
                        <p className="font-body text-[11px] text-text-secondary">Ref: <span className="font-mono font-bold text-text-primary">{lesson.reference || "N/A"}</span></p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => promptStatusUpdate(lesson.id, "cancelled", lesson.reference)}
                            disabled={actionLoading === lesson.id}
                            className="px-3 py-1 bg-white border border-border-light text-text-primary rounded-full text-xs font-medium hover:bg-surface-muted transition-colors disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => promptStatusUpdate(lesson.id, "confirmed", lesson.reference)}
                            disabled={actionLoading === lesson.id}
                            className="px-3 py-1 bg-accent-blue text-white rounded-full text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                          >
                            Approve
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

        {/* Modal for Manual Booking or Time Block */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-border-light shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-xl font-bold text-text-primary">Create Booking Entry</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-subtle hover:text-text-primary">
                  <HugeIcon name="cancel" size={20} />
                </button>
              </div>

              <div className="flex gap-2 p-1 bg-surface-muted rounded-xl mb-6">
                <button 
                  onClick={() => setModalType("booking")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    modalType === "booking" ? "bg-white text-text-primary shadow-xs" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Student Booking
                </button>
                <button 
                  onClick={() => setModalType("block")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    modalType === "block" ? "bg-white text-text-primary shadow-xs" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Block Time Slot
                </button>
              </div>

              <form onSubmit={handleManualBooking} className="space-y-4">
                <div>
                  <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={modalData.date}
                    onChange={(e) => setModalData({...modalData, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div>
                  <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Time</label>
                  <input 
                    type="time" 
                    required 
                    value={modalData.time}
                    onChange={(e) => setModalData({...modalData, time: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:outline-none focus:border-accent-blue"
                  />
                </div>

                {modalType === "booking" ? (
                  <>
                    <div>
                      <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Student Email</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="student@example.com"
                        value={modalData.studentEmail}
                        onChange={(e) => setModalData({...modalData, studentEmail: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:outline-none focus:border-accent-blue"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Session Tier</label>
                      <select 
                        value={modalData.tier}
                        onChange={(e) => setModalData({...modalData, tier: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:outline-none focus:border-accent-blue"
                      >
                        <option value="trial">Free Trial (30 min)</option>
                        <option value="standard">Standard (60 min)</option>
                        <option value="intensive">Intensive (90 min)</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Block Reason</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g., Doctor appointment, Personal"
                      value={modalData.reason}
                      onChange={(e) => setModalData({...modalData, reason: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 py-3 border border-border-light text-text-secondary rounded-full font-body text-xs font-semibold hover:bg-surface-muted"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-1/2 py-3 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors"
                  >
                    {isSubmitting ? "Creating..." : "Save Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Global Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModalData.isOpen}
          title={confirmModalData.title}
          description={confirmModalData.description}
          confirmText={confirmModalData.confirmText}
          variant={confirmModalData.variant}
          iconName={confirmModalData.iconName}
          loading={!!actionLoading}
          onConfirm={confirmModalData.onConfirm}
          onCancel={() => setConfirmModalData(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  const handlePayment = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await response.json();
      
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error(data.error || "Failed to initialize payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while initializing payment.");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingPaymentBooking = bookings.find(b => b.status === "pending_payment");

  // Student View
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-light">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">Your Lessons Schedule</h1>
          <p className="font-body text-xs md:text-sm text-text-secondary mt-1">Review upcoming classes and join Google Meet sessions.</p>
        </div>
        <Link 
          href="/dashboard/book"
          className="px-5 py-2.5 bg-text-primary text-white rounded-full text-xs font-semibold hover:bg-black transition-colors inline-block"
        >
          Book Another Session
        </Link>
      </div>

      {/* PENDING PAYMENT ALERT BANNER */}
      {pendingPaymentBooking && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/15 border border-amber-500/30 rounded-[28px] p-6 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-full">
                Pending Payment
              </span>
              <span className="text-xs font-mono text-amber-950 font-bold">Ref: {pendingPaymentBooking.reference}</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-amber-950 mt-1">
              Payment Required: {pendingPaymentBooking.tier.charAt(0).toUpperCase() + pendingPaymentBooking.tier.slice(1)} Lesson
            </h3>
            <p className="font-body text-xs text-amber-900/90">
              Scheduled: {pendingPaymentBooking.formattedSchedule || pendingPaymentBooking.scheduledDate}. Complete payment to unlock your Google Meet link and confirm your booking.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handlePayment(pendingPaymentBooking.id)}
              disabled={actionLoading === pendingPaymentBooking.id}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-all shadow-md flex-1 md:flex-initial disabled:opacity-50"
            >
              {actionLoading === pendingPaymentBooking.id ? "Redirecting..." : "Pay Now (OPay, Cards & Bank)"}
            </button>
            <button
              onClick={() => promptStatusUpdate(pendingPaymentBooking.id, "cancelled", pendingPaymentBooking.reference)}
              className="px-4 py-3 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <HugeIcon name="calendar" size={32} className="text-text-subtle mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">No lessons scheduled</h3>
            <p className="font-body text-xs text-text-secondary mb-4">Book your first 1-on-1 language lesson now.</p>
            <Link href="/dashboard/book" className="px-5 py-2.5 bg-text-primary text-white rounded-full text-xs font-semibold hover:bg-black transition-colors inline-block">
              Schedule Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const dateStr = booking.scheduledDate || booking.createdAt.split("T")[0];
              const timeStr = booking.scheduledTime || "10:00";
              const dualTime = formatDualTime(dateStr, timeStr, userData?.timeZone);
              const isActionable = booking.status === "confirmed" || booking.status === "paid";

              return (
                <div key={booking.id} className="p-5 bg-surface-near-white rounded-2xl border border-border-light flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm text-text-primary capitalize">{booking.tier} Session</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        booking.status === "confirmed" || booking.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : booking.status === "completed"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {booking.status === "paid" ? "Paid & Confirmed" : booking.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="font-body text-xs text-text-secondary flex items-center gap-1.5 flex-wrap">
                      <HugeIcon name="clock" size={13} className="text-accent-blue" />
                      <span className="font-semibold text-text-primary">{dateStr} at {dualTime.watFormatted}</span>
                      {dualTime.isDifferent && (
                        <span className="px-2 py-0.5 bg-accent-blue/10 text-accent-blue rounded-md text-[10px] font-bold">
                          {dualTime.localFormatted} (Your Time)
                        </span>
                      )}
                      <span className="text-text-subtle">• Ref: {booking.reference}</span>
                      {booking.meetLink && isActionable && (
                        <button
                          type="button"
                          onClick={() => {
                            const code = booking.meetingCode || booking.meetLink?.split("/").pop() || "";
                            navigator.clipboard.writeText(code);
                            toast.success(`Meeting code "${code}" copied!`);
                          }}
                          className="px-2 py-0.5 bg-surface-muted hover:bg-surface-near-white border border-border-light rounded-md text-[10px] font-mono text-text-primary transition-colors flex items-center gap-1"
                        >
                          <span>Room Code: {booking.meetingCode || booking.meetLink?.split("/").pop()}</span>
                          <span className="text-[9px] opacity-75 font-sans">📋</span>
                        </button>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                    {booking.status === "pending_payment" && (
                      <button
                        type="button"
                        onClick={() => handlePayment(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
                      >
                        {actionLoading === booking.id ? "Redirecting..." : "Pay Now (OPay, Cards & Bank)"}
                      </button>
                    )}

                    {(booking.meetLink || booking.videoCallUrl) && isActionable && (
                      <a 
                        href={booking.meetLink || booking.videoCallUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-accent-blue text-white rounded-full text-xs font-semibold hover:bg-accent-blue-hover transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <HugeIcon name="video" size={14} />
                        <span>Join Room</span>
                      </a>
                    )}

                    {isActionable && (
                      <button
                        onClick={() => handleOpenReschedule(booking)}
                        className="px-3.5 py-2 text-xs font-semibold text-text-primary bg-white hover:bg-surface-muted border border-border-light rounded-full transition-colors flex items-center gap-1"
                      >
                        <HugeIcon name="calendar" size={14} />
                        <span>Reschedule</span>
                      </button>
                    )}

                    {booking.status !== "completed" && booking.status !== "cancelled" && (
                      <button
                        onClick={() => promptStatusUpdate(booking.id, "cancelled", booking.reference)}
                        disabled={actionLoading === booking.id}
                        className="px-3 py-2 text-xs font-medium text-text-secondary hover:text-red-600 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reschedule Session Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleRescheduleSubmit}
            className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-border-light shadow-2xl space-y-4 font-body"
          >
            <div className="flex items-center justify-between border-b border-border-light pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Reschedule {rescheduleBooking.tier} Lesson
                </h3>
                <p className="text-xs text-text-secondary">
                  Ref: {rescheduleBooking.reference} • Free under 24h policy.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
              >
                <HugeIcon name="cancel" size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">New Time Slot (WAT)</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue"
                />
              </div>

              <div className="p-3 bg-accent-blue/5 rounded-xl border border-accent-blue/10 text-[11px] text-text-secondary">
                💡 Your instructor will be notified immediately of this time adjustment.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="px-4 py-2 rounded-full border border-border-light text-xs font-semibold text-text-secondary hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rescheduling}
                className="px-5 py-2 rounded-full bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
              >
                {rescheduling ? "Updating..." : "Confirm New Slot"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalData.isOpen}
        title={confirmModalData.title}
        description={confirmModalData.description}
        confirmText={confirmModalData.confirmText}
        variant={confirmModalData.variant}
        iconName={confirmModalData.iconName}
        loading={!!actionLoading}
        onConfirm={confirmModalData.onConfirm}
        onCancel={() => setConfirmModalData(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
