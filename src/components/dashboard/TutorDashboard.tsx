import React, { useEffect, useState } from "react";
import { UserData } from "@/lib/AuthContext";
import { ClockIcon, UserGroupIcon, ChartBarIcon, CalendarIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "./StudentDashboard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";

export default function TutorDashboard({ userData }: { userData: UserData }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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
  const hoursTaught = completedLessons.length; // Assuming 1 hr per lesson
  const activeStudents = new Set(bookings.filter(l => l.status !== "cancelled").map(l => l.studentId)).size;
  
  const upcomingLessons = bookings.filter(l => l.status === "confirmed").sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const nextLesson = upcomingLessons[0];

  const pastLessons = bookings.filter(l => l.status === "completed" || l.status === "cancelled").slice(0, 3);
  const pendingApprovals = bookings.filter(l => l.status === "pending_wa");

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/tutor/bookings/manual/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" })
      });
      // toast will be added later if needed, state auto updates via onSnapshot
    } catch (e) {
      console.error(e);
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
        const dayEarnings = dayBookings.reduce((sum, lesson) => sum + (lesson.tier === "standard" ? 15000 : lesson.tier === "intensive" ? 25000 : 0), 0);
        data.push({ name: dayStr, earnings: dayEarnings });
    }
    return data;
  }, [bookings]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 pb-8 border-b border-border-warm">
        <div>
          <h1 className="font-heading text-4xl md:text-[44px] font-bold text-oboe-black leading-[1.1] mb-2">
            Welcome back,
          </h1>
          <h2 className="font-heading text-4xl md:text-[44px] font-bold text-oboe-black leading-[1.1] mb-4">
            {userData.displayName || userData.email?.split("@")[0]}
          </h2>
          <p className="font-body text-[17px] text-mid-gray-brown">Manage your schedule, students, and earnings.</p>
        </div>
        <div className="hidden md:block">
          <span className="px-6 py-2 bg-gradient-to-tr from-chip-green/80 to-chip-blue/80 backdrop-blur-md text-[#2a2522] text-xs font-bold uppercase tracking-[0.25em] rounded-full shadow-sm border border-white/60">
            Instructor
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Cards - Premium Large Overlay Styling */}
        <div className="group bg-oboe-black p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col justify-end min-h-[180px] cursor-default">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-15 transition-all duration-500 transform -rotate-12 group-hover:-rotate-8 group-hover:scale-110">
            <svg width="0" height="0">
              <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="rgba(255, 255, 255, 0)" offset="30%" />
                <stop stopColor="#f5d576" offset="100%" />
              </linearGradient>
            </svg>
            <ClockIcon className="w-40 h-40" style={{ stroke: "url(#clockGradient)" }} />
          </div>
          <div className="relative z-10">
            <p className="font-body text-sm text-gray-300 mb-2 uppercase tracking-wider font-semibold">Hours Taught</p>
            <p className="font-heading text-5xl font-bold text-white">{loading ? "-" : hoursTaught}</p>
          </div>
        </div>
        
        <div className="group bg-chip-blue p-8 rounded-3xl border border-border-warm shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-end min-h-[180px] cursor-default">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-15 transition-all duration-500 transform -rotate-12 group-hover:-rotate-8 group-hover:scale-110">
            <svg width="0" height="0">
              <linearGradient id="usersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="rgba(24, 76, 133, 0)" offset="30%" />
                <stop stopColor="#184c85" offset="100%" />
              </linearGradient>
            </svg>
            <UserGroupIcon className="w-40 h-40" style={{ stroke: "url(#usersGradient)" }} />
          </div>
          <div className="relative z-10">
            <p className="font-body text-sm text-dark-charcoal/80 mb-2 uppercase tracking-wider font-semibold group-hover:text-dark-charcoal transition-colors">Active Students</p>
            <p className="font-heading text-5xl font-bold text-oboe-black">{loading ? "-" : activeStudents}</p>
          </div>
        </div>

        <div className="group bg-chip-pink p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-end min-h-[180px] cursor-default border border-border-warm">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-15 transition-all duration-500 transform -rotate-12 group-hover:-rotate-8 group-hover:scale-110">
            <svg width="0" height="0">
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="rgba(133, 34, 24, 0)" offset="30%" />
                <stop stopColor="#852218" offset="100%" />
              </linearGradient>
            </svg>
            <ChartBarIcon className="w-40 h-40" style={{ stroke: "url(#chartGradient)" }} />
          </div>
          <div className="relative z-10">
            <p className="font-body text-sm text-dark-charcoal/80 mb-2 uppercase tracking-wider font-semibold">Total Earnings</p>
            <p className="font-heading text-5xl font-bold text-oboe-black">
              {loading ? "-" : `₦${totalEarnings.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytical Graph */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-chip-pink/5 p-8 rounded-3xl border border-border-warm shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-chip-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-chip-pink/20 transition-colors duration-700" />
          <div className="flex justify-between items-center mb-6 z-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-oboe-black">Revenue Analytics</h2>
              <p className="font-body text-sm text-mid-gray-brown">Your earnings over the last 7 days</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full z-10">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cta-yellow border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} tickFormatter={(val) => `₦${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`₦${value.toLocaleString()}`, "Earnings"]}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#4A90E2" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Summary Widgets */}
        <div className="space-y-6">
          {/* Next Lesson Widget */}
          <div className="bg-oboe-black rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-15 transition-all duration-500 transform -rotate-12 group-hover:-rotate-8 group-hover:scale-110">
              <svg width="0" height="0">
                <linearGradient id="calGradientTutor" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="rgba(255, 255, 255, 0)" offset="30%" />
                  <stop stopColor="#f5d576" offset="100%" />
                </linearGradient>
              </svg>
              <CalendarIcon className="w-40 h-40" style={{ stroke: "url(#calGradientTutor)" }} />
            </div>
            <h3 className="font-heading text-2xl font-bold text-cta-yellow mb-4">Up Next</h3>
            {loading ? (
              <div className="animate-pulse h-16 bg-white/10 rounded-xl" />
            ) : nextLesson ? (
              <div className="relative z-10">
                <p className="font-heading text-2xl font-bold mb-1 capitalize">{nextLesson.tier} Tier</p>
                <p className="font-body text-sm text-gray-300 mb-6">
                  {new Date(nextLesson.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <Link href="/dashboard/schedule" className="inline-flex items-center gap-2 text-sm font-medium hover:text-cta-yellow transition-colors">
                  View Full Schedule <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="relative z-10">
                <p className="font-body text-sm text-gray-300 mb-6">No upcoming lessons scheduled.</p>
                <Link href="/dashboard/schedule" className="inline-flex items-center gap-2 text-sm font-medium hover:text-cta-yellow transition-colors">
                  View Schedule <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Recent History Widget */}
          <div className="bg-white rounded-3xl p-6 border border-border-warm shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-2xl font-bold text-oboe-black">Recent History</h3>
              <Link href="/dashboard/history" className="text-sm font-medium text-dark-charcoal underline decoration-border-warm hover:decoration-dark-charcoal underline-offset-4 transition-colors">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                <div className="h-10 bg-surface-base animate-pulse rounded-lg" />
                <div className="h-10 bg-surface-base animate-pulse rounded-lg" />
              </div>
            ) : pastLessons.length > 0 ? (
              <div className="space-y-3">
                {pastLessons.map(lesson => (
                  <div key={lesson.id} className="flex justify-between items-center p-3 bg-surface-base rounded-xl border border-border-warm/50">
                    <div>
                      <p className="font-heading font-semibold text-sm text-oboe-black capitalize">{lesson.tier}</p>
                      <p className="font-body text-xs text-mid-gray-brown">{new Date(lesson.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        lesson.status === "completed" ? "bg-chip-green text-dark-charcoal" : "bg-chip-pink text-dark-charcoal"
                      }`}>
                      {lesson.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-mid-gray-brown text-center py-4">No recent history.</p>
            )}
          </div>
          
          {/* Pending Approvals Widget */}
          <div className="bg-gradient-to-br from-chip-yellow/20 to-chip-yellow/5 rounded-3xl p-6 border border-chip-yellow/30 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-chip-yellow/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
             <div className="flex justify-between items-center mb-4 relative z-10">
               <h3 className="font-heading text-2xl font-bold text-oboe-black flex items-center gap-2">
                 Action Required
                 {pendingApprovals.length > 0 && (
                   <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cta-yellow text-xs font-bold text-oboe-black animate-bounce">
                     {pendingApprovals.length}
                   </span>
                 )}
               </h3>
             </div>
             {loading ? (
               <div className="space-y-3">
                 <div className="h-10 bg-white/50 animate-pulse rounded-lg" />
               </div>
             ) : pendingApprovals.length > 0 ? (
               <div className="space-y-3 relative z-10">
                 {pendingApprovals.map(lesson => (
                   <div key={lesson.id} className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-border-warm/50 shadow-sm">
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="font-heading font-semibold text-sm text-oboe-black">{lesson.reference}</p>
                         <p className="font-body text-xs text-mid-gray-brown capitalize">{lesson.tier} Tier</p>
                       </div>
                       <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-chip-yellow/40 text-dark-charcoal">
                         Pending WA
                       </span>
                     </div>
                     <button 
                       onClick={() => handleApprove(lesson.id)}
                       className="w-full py-2 bg-oboe-black text-white text-xs font-bold rounded-lg hover:bg-dark-charcoal transition-colors"
                     >
                       Approve & Confirm
                     </button>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="font-body text-sm text-mid-gray-brown text-center py-4 relative z-10">No pending approvals.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
