import React, { useEffect, useState } from "react";
import { UserData } from "@/lib/AuthContext";
import HugeIcon from "@/components/ui/HugeIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "./StudentDashboard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import { toast } from "sonner";

export default function TutorDashboard({ userData }: { userData: UserData }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [rejectModalBooking, setRejectModalBooking] = useState<Booking | null>(null);
  const [completeModalBooking, setCompleteModalBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      
      setBookings(fetchedBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData.uid]);

  // Derived stats
  const completedLessons = bookings.filter(l => l.status === "completed");
  const totalEarnings = completedLessons.reduce((sum, lesson) => sum + (lesson.tier === "standard" ? 15000 : lesson.tier === "intensive" ? 25000 : 0), 0);
  const hoursTaught = completedLessons.length;
  const activeStudents = new Set(bookings.filter(l => l.status !== "cancelled").map(l => l.studentId)).size;
  
  const upcomingLessons = bookings.filter(l => l.status === "confirmed" || l.status === "paid").sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const nextLesson = upcomingLessons[0];

  const pastLessons = bookings.filter(l => l.status === "completed" || l.status === "cancelled").slice(0, 3);
  const pendingApprovals = bookings.filter(l => l.status === "pending_wa");

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/tutor/bookings/manual/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" })
      });
      toast.success("Booking approved and confirmed.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectModalBooking) return;
    setActionLoading(true);
    try {
      await fetch(`/api/tutor/bookings/manual/${rejectModalBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" })
      });
      toast.success("Booking rejected.");
      setRejectModalBooking(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmComplete = async () => {
    if (!completeModalBooking) return;
    setActionLoading(true);
    try {
      await fetch(`/api/tutor/bookings/manual/${completeModalBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" })
      });
      toast.success("Lesson marked as completed!");
      setCompleteModalBooking(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Generate chart data (last 7 days)
  const chartData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    const completed = bookings.filter(l => l.status === "completed");
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayBookings = completed.filter(b => {
            const bDate = new Date(b.createdAt);
            return bDate.getDate() === d.getDate() && bDate.getMonth() === d.getMonth() && bDate.getFullYear() === d.getFullYear();
        });
        
        const earnings = dayBookings.reduce((sum, b) => sum + (b.tier === "standard" ? 15000 : b.tier === "intensive" ? 25000 : 0), 0);
        data.push({ day: dayStr, earnings });
    }
    return data;
  }, [bookings]);

  return (
    <div className="space-y-8 font-body">
      
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-[28px] border border-border-light shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
        <div>
          <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block border border-accent-blue/20">
            Instructor Portal
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Welcome back, {userData.displayName || userData.firstName || userData.fullName || "Tutor"}
          </h1>
          <p className="font-body text-xs sm:text-sm text-text-secondary mt-1">
            Manage your teaching schedule, incoming session requests, and revenue analytics.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/schedule"
            className="px-6 py-3 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors shrink-0 shadow-xs"
          >
            Manage Schedule
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] p-6 border border-border-light shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-border-light flex items-center justify-center text-text-primary shrink-0">
            <HugeIcon name="clock" size={24} />
          </div>
          <div>
            <p className="font-body text-xs text-text-secondary">Hours Taught</p>
            <p className="font-heading text-2xl font-bold text-text-primary mt-0.5">{hoursTaught} hrs</p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-border-light shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue shrink-0">
            <HugeIcon name="sparkles" size={24} />
          </div>
          <div>
            <p className="font-body text-xs text-text-secondary">Active Students</p>
            <p className="font-heading text-2xl font-bold text-text-primary mt-0.5">{activeStudents}</p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-border-light shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-border-light flex items-center justify-center text-text-primary shrink-0">
            <HugeIcon name="credit-card" size={24} />
          </div>
          <div>
            <p className="font-body text-xs text-text-secondary">Total Earnings</p>
            <p className="font-heading text-2xl font-bold text-text-primary mt-0.5">₦{totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main 2-Col Area: Revenue Chart & Pending Approvals */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action Required: Pending Approvals */}
          {pendingApprovals.length > 0 && (
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-amber-200 shadow-xs bg-amber-50/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-text-primary">Action Required</h2>
                  <p className="font-body text-xs text-text-secondary">Pending bookings awaiting WhatsApp confirmation</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                  {pendingApprovals.length} Pending
                </span>
              </div>

              <div className="space-y-4">
                {pendingApprovals.map(b => (
                  <div key={b.id} className="p-4 bg-white rounded-2xl border border-border-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-text-primary capitalize">{b.tier} Lesson</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-surface-muted rounded-full">Ref: {b.reference}</span>
                      </div>
                      <p className="font-body text-xs text-text-secondary mt-1">
                        Booked: {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleApprove(b.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-text-primary text-white rounded-full text-xs font-medium hover:bg-black transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectModalBooking(b)}
                        disabled={actionLoading}
                        className="px-3 py-2 text-xs font-medium text-text-secondary hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Analytics Chart */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-border-light shadow-xs">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-1">Weekly Revenue</h2>
            <p className="font-body text-xs text-text-secondary mb-6">Earnings breakdown over the last 7 days</p>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#898989" fontSize={11} tickLine={false} />
                  <YAxis stroke="#898989" fontSize={11} tickLine={false} tickFormatter={(val) => `₦${val/1000}k`} />
                  <Tooltip
                    formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Earnings']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#earningsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Next Class & Lesson Management */}
        <div className="space-y-8">
          
          {/* Next Class Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-border-light shadow-xs">
            <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Next Scheduled Class</h3>
            {nextLesson ? (
              <div className="space-y-4">
                <div className="p-4 bg-surface-near-white rounded-2xl border border-border-light">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-accent-blue/10 text-accent-blue rounded-full capitalize">
                    {nextLesson.tier} Lesson
                  </span>
                  <h4 className="font-heading font-bold text-base text-text-primary mt-2">1-on-1 Student Session</h4>
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
                      Start Meeting Room
                    </a>
                  ) : (
                    <button 
                      onClick={() => toast.info("Create a meet link from your schedule tab.")}
                      className="w-full text-center px-4 py-2.5 bg-surface-muted text-text-subtle rounded-full text-xs font-medium cursor-not-allowed border border-border-light"
                    >
                      Join Meeting (Not Ready)
                    </button>
                  )}
                  
                  <button
                    onClick={() => setCompleteModalBooking(nextLesson)}
                    className="w-full text-center px-4 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    Mark as Completed
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-body text-xs text-text-secondary">No upcoming classes scheduled today.</p>
            )}
          </div>

          {/* Recent History Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-border-light shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-lg font-bold text-text-primary">Recent Activity</h3>
              <Link href="/dashboard/schedule" className="text-xs font-medium text-accent-blue hover:underline transition-colors">
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
              <p className="font-body text-xs text-text-subtle text-center py-4">No recent activity.</p>
            )}
          </div>

        </div>

      </div>

      {/* Confirmation Modal for Booking Rejection */}
      <ConfirmationModal
        isOpen={!!rejectModalBooking}
        title="Reject Booking Request?"
        description={`Are you sure you want to reject this booking (Ref: ${rejectModalBooking?.reference || ""})? If the student has already paid, an automatic refund credit will be issued.`}
        confirmText="Confirm Rejection"
        cancelText="Keep Booking"
        variant="danger"
        iconName="alert"
        loading={actionLoading}
        onConfirm={confirmReject}
        onCancel={() => setRejectModalBooking(null)}
      />

      {/* Confirmation Modal for Marking Completed */}
      <ConfirmationModal
        isOpen={!!completeModalBooking}
        title="Mark Lesson Completed?"
        description="Marking this session as completed will update your earnings and trigger the post-lesson WhatsApp feedback notification to the student."
        confirmText="Mark Completed"
        cancelText="Cancel"
        variant="primary"
        iconName="sparkles"
        loading={actionLoading}
        onConfirm={confirmComplete}
        onCancel={() => setCompleteModalBooking(null)}
      />
    </div>
  );
}
