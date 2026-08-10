import React, { useEffect, useState } from "react";
import { UserData } from "@/lib/AuthContext";
import HugeIcon from "@/components/ui/HugeIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import EquipmentTestModal from "./EquipmentTestModal";

export interface Booking {
  id: string;
  studentId: string;
  reference: string;
  tier: string;
  calcomBookingId?: number;
  status: "pending_wa" | "pending_payment" | "confirmed" | "paid" | "completed" | "cancelled";
  createdAt: string;
  meetLink?: string;
}

export default function StudentDashboard({ userData }: { userData: UserData }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [modalBookingToCancel, setModalBookingToCancel] = useState<Booking | null>(null);

  const handlePayment = async (bookingId: string) => {
    setPayingBookingId(bookingId);
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
      setPayingBookingId(null);
    }
  };

  const confirmCancel = async () => {
    if (!modalBookingToCancel) return;
    
    setCancellingBookingId(modalBookingToCancel.id);
    try {
      const res = await fetch(`/api/student/bookings/${modalBookingToCancel.id}/cancel`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Booking cancelled successfully.");
        setModalBookingToCancel(null);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to cancel booking.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while cancelling.");
    } finally {
      setCancellingBookingId(null);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      where("studentId", "==", userData.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      
      // Sort client-side to avoid requiring a composite Firestore index
      fetchedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBookings(fetchedBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData.uid]);

  const activeBookings = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled");
  const upcomingLessons = activeBookings.filter(b => b.status === "confirmed" || b.status === "paid" || b.status === "pending_wa" || b.status === "pending_payment").sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const nextLesson = upcomingLessons[0];
  const pastLessons = bookings.filter(b => b.status === "completed" || b.status === "cancelled").slice(0, 3);

  // Recharts demo activity data
  const activityData = [
    { day: "Mon", hours: 1 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 1 },
    { day: "Sat", hours: 2 },
    { day: "Sun", hours: 0 },
  ];

  return (
    <div className="space-y-8 font-body">
      
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-[28px] border border-border-light shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
        <div>
          <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block border border-accent-blue/20">
            Student Portal
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Welcome back, {userData.displayName || userData.firstName || userData.fullName || "Student"}
          </h1>
          <p className="font-body text-xs sm:text-sm text-text-secondary mt-1">
            Track your language progress, upcoming Google Meet lessons, and study activity.
          </p>
        </div>
        <Link
          href="/dashboard/book"
          className="px-6 py-3 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors shrink-0 shadow-xs"
        >
          Book a Lesson
        </Link>
      </div>

      {/* Quick Action Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/book"
          className="p-5 bg-white rounded-2xl border border-border-light hover:border-accent-blue/40 transition-colors group flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-105 transition-transform">
            <HugeIcon name="calendar" size={20} />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-text-primary">Schedule Session</h4>
            <p className="font-body text-[11px] text-text-secondary">Pick a slot & instant link</p>
          </div>
        </Link>

        <Link
          href="/dashboard/subjects"
          className="p-5 bg-white rounded-2xl border border-border-light hover:border-accent-blue/40 transition-colors group flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-text-primary group-hover:scale-105 transition-transform">
            <HugeIcon name="brain" size={20} />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-text-primary">Browse Subjects</h4>
            <p className="font-body text-[11px] text-text-secondary">Spanish, French, English</p>
          </div>
        </Link>

        <button
          onClick={() => setIsTestModalOpen(true)}
          className="p-5 bg-white rounded-2xl border border-border-light hover:border-accent-blue/40 transition-colors group flex items-center gap-4 text-left w-full"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-text-primary group-hover:scale-105 transition-transform">
            <HugeIcon name="video" size={20} />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-text-primary">Test Equipment</h4>
            <p className="font-body text-[11px] text-text-secondary">Check mic & camera</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main 2-column: Active Bookings & Weekly Activity Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Bookings List */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-border-light shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold text-text-primary">Your Active Sessions</h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-surface-muted rounded-full text-text-secondary">
                {activeBookings.length} Active
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-16 bg-surface-muted animate-pulse rounded-2xl" />
                <div className="h-16 bg-surface-muted animate-pulse rounded-2xl" />
              </div>
            ) : activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 bg-surface-near-white rounded-2xl border border-border-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-border-subtle transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-text-primary capitalize">
                          {b.tier} Session
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                            b.status === "confirmed" || b.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {b.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="font-body text-xs text-text-secondary mt-1">
                        Ref: <span className="font-mono">{b.reference}</span> • Created: {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {b.status === "pending_payment" && (
                        <button
                          onClick={() => handlePayment(b.id)}
                          disabled={payingBookingId === b.id}
                          className="px-4 py-2 bg-accent-blue text-white rounded-full text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                          {payingBookingId === b.id ? "Redirecting..." : "Pay Now"}
                        </button>
                      )}

                      {b.meetLink && (
                        <a
                          href={b.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-text-primary text-white rounded-full text-xs font-medium hover:bg-black transition-colors"
                        >
                          Join Meet
                        </a>
                      )}

                      <button
                        onClick={() => setModalBookingToCancel(b)}
                        disabled={cancellingBookingId === b.id}
                        className="px-3 py-2 text-xs font-medium text-text-secondary hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="font-body text-xs sm:text-sm text-text-secondary mb-4">You have no active lesson bookings.</p>
                <Link
                  href="/dashboard/book"
                  className="px-5 py-2.5 bg-text-primary text-white rounded-full text-xs font-semibold hover:bg-black transition-colors inline-block"
                >
                  Book Your First Lesson
                </Link>
              </div>
            )}
          </div>

          {/* Learning Activity Chart */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-border-light shadow-xs">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-1">Learning Activity</h2>
            <p className="font-body text-xs text-text-secondary mb-6">Hours spent speaking and learning this week</p>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#898989" fontSize={11} tickLine={false} />
                  <YAxis stroke="#898989" fontSize={11} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  />
                  <Bar dataKey="hours" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Next Session & History */}
        <div className="space-y-8">
          
          {/* Next Lesson Card */}
          <div className="bg-white rounded-[24px] p-6 border border-border-light shadow-xs">
            <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Next Upcoming Lesson</h3>
            {nextLesson ? (
              <div className="space-y-4">
                <div className="p-4 bg-surface-near-white rounded-2xl border border-border-light">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-accent-blue/10 text-accent-blue rounded-full capitalize">
                    {nextLesson.tier}
                  </span>
                  <h4 className="font-heading font-bold text-base text-text-primary mt-2">1-on-1 Conversation</h4>
                  <p className="font-body text-xs text-text-secondary mt-1">
                    Date: {new Date(nextLesson.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  {nextLesson.meetLink ? (
                    <a
                      href={nextLesson.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block text-center px-4 py-2.5 bg-accent-blue text-white rounded-full text-xs font-medium hover:bg-blue-600 transition-colors"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <button 
                      onClick={() => toast.info("Meeting links will be generated closer to the session.")}
                      className="w-full text-center px-4 py-2.5 bg-surface-muted text-text-subtle rounded-full text-xs font-medium cursor-not-allowed border border-border-light"
                    >
                      Join Meeting (Pending)
                    </button>
                  )}
                  <Link href="/dashboard/schedule" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-blue hover:underline mt-1">
                    <span>View Full Schedule</span>
                    <HugeIcon name="arrow-right" size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-body text-xs text-text-secondary mb-5">You don&apos;t have any upcoming lessons scheduled.</p>
                <Link href="/dashboard/book" className="inline-block px-5 py-2.5 bg-text-primary text-white rounded-full text-xs font-medium hover:bg-black transition-colors">
                  Book a Lesson
                </Link>
              </div>
            )}
          </div>

          {/* Recent History Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-border-light shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-lg font-bold text-text-primary">Recent History</h3>
              <Link href="/dashboard/history" className="text-xs font-medium text-accent-blue hover:underline transition-colors">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                <div className="h-10 bg-surface-muted animate-pulse rounded-xl" />
                <div className="h-10 bg-surface-muted animate-pulse rounded-xl" />
              </div>
            ) : pastLessons.length > 0 ? (
              <div className="space-y-3">
                {pastLessons.map(lesson => (
                  <div key={lesson.id} className="flex justify-between items-center p-3 bg-surface-near-white rounded-xl border border-border-light">
                    <div>
                      <p className="font-heading font-bold text-xs text-text-primary capitalize">{lesson.tier}</p>
                      <p className="font-body text-[11px] text-text-secondary mt-0.5">{new Date(lesson.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                        lesson.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                      {lesson.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-xs text-text-subtle text-center py-4">No recent history.</p>
            )}
          </div>
        </div>
      </div>

      <EquipmentTestModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} />

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmationModal
        isOpen={!!modalBookingToCancel}
        title="Cancel Lesson Booking?"
        description={`Are you sure you want to cancel this ${modalBookingToCancel?.tier || ""} session (Ref: ${modalBookingToCancel?.reference || ""})? Under our 24-hour policy, this time slot will be reopened.`}
        confirmText="Confirm Cancellation"
        cancelText="Keep Booking"
        variant="danger"
        iconName="alert"
        loading={!!cancellingBookingId}
        onConfirm={confirmCancel}
        onCancel={() => setModalBookingToCancel(null)}
      />
    </div>
  );
}
