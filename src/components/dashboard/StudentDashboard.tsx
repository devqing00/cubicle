import React, { useEffect, useState } from "react";
import { UserData } from "@/lib/AuthContext";
import { CalendarIcon, AcademicCapIcon, VideoCameraIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
  videoCallUrl?: string;
}

export default function StudentDashboard({ userData }: { userData: UserData }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

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

  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      where("studentId", "==", userData.uid),
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

  const activeBookings = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled");
  const upcomingLessons = activeBookings.filter(b => b.status === "confirmed" || b.status === "paid").sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const nextLesson = upcomingLessons[0];
  const pastLessons = bookings.filter(b => b.status === "completed" || b.status === "cancelled").slice(0, 3);
  const completedLessons = bookings.filter(b => b.status === "completed");

  // Generate chart data (last 7 days activity)
  const chartData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayBookings = completedLessons.filter(b => {
            const bDate = new Date(b.createdAt);
            return bDate.getDate() === d.getDate() && bDate.getMonth() === d.getMonth() && bDate.getFullYear() === d.getFullYear();
        });

        data.push({ name: dayStr, lessons: dayBookings.length });
    }
    return data;
  }, [completedLessons]);

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
          <p className="font-body text-[17px] text-mid-gray-brown">Track your progress and manage upcoming lessons.</p>
        </div>
        <div className="hidden md:block">
          <span className="px-6 py-2 bg-gradient-to-tr from-chip-blue/80 to-[#c8e1f5]/80 backdrop-blur-md text-[#1a2b3c] text-xs font-bold uppercase tracking-[0.25em] rounded-full shadow-sm border border-white/60">
            Student
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Analytics & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Analytical Graph */}
          <div className="bg-gradient-to-br from-white to-chip-blue/5 p-8 rounded-3xl border border-border-warm shadow-sm flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-chip-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-chip-blue/20 transition-colors duration-700" />
            <div className="flex justify-between items-center mb-6 z-10">
              <div>
                <h2 className="font-heading text-2xl font-bold text-oboe-black">Learning Activity</h2>
                <p className="font-body text-sm text-mid-gray-brown">Lessons attended over the last 7 days</p>
              </div>
            </div>
            <div className="flex-1 min-h-[250px] w-full z-10">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-cta-yellow border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip 
                      cursor={{fill: '#f9f9f9'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [`${value} Lessons`, "Activity"]}
                    />
                    <Bar dataKey="lessons" fill="#4A90E2" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Premium Quick Actions */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-oboe-black mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => toast.info("Subject catalog is coming soon!")}
                className="w-full bg-chip-green/20 p-6 rounded-2xl border border-chip-green/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex items-center gap-4 group cursor-pointer"
              >
                <div className="p-4 bg-chip-green rounded-xl shadow-inner group-hover:scale-110 transition-transform border border-white/40">
                  <AcademicCapIcon className="w-8 h-8 text-oboe-black" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-oboe-black text-lg group-hover:text-dark-charcoal transition-colors">Browse Subjects</h3>
                  <p className="font-body text-sm text-dark-charcoal/70">Explore topics to learn</p>
                </div>
              </button>

              <button 
                onClick={() => setIsTestModalOpen(true)}
                className="w-full bg-chip-blue/20 p-6 rounded-2xl border border-chip-blue/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex items-center gap-4 group cursor-pointer"
              >
                <div className="p-4 bg-chip-blue rounded-xl shadow-inner group-hover:scale-110 transition-transform border border-white/40">
                  <VideoCameraIcon className="w-8 h-8 text-oboe-black" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-oboe-black text-lg group-hover:text-dark-charcoal transition-colors">Test Equipment</h3>
                  <p className="font-body text-sm text-dark-charcoal/70">Check your camera & mic</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Summary Widgets */}
        <div className="space-y-6">
          
          {/* Next Lesson Widget */}
          <div className="bg-oboe-black rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-15 transition-all duration-500 transform -rotate-12 group-hover:-rotate-8 group-hover:scale-110">
              <svg width="0" height="0">
                <linearGradient id="calGradientStudent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="rgba(255, 255, 255, 0)" offset="30%" />
                  <stop stopColor="#f5d576" offset="100%" />
                </linearGradient>
              </svg>
              <CalendarIcon className="w-40 h-40" style={{ stroke: "url(#calGradientStudent)" }} />
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
                <div className="flex flex-col gap-3">
                  {nextLesson.status === "confirmed" ? (
                    <button 
                      onClick={() => handlePayment(nextLesson.id)}
                      disabled={payingBookingId === nextLesson.id}
                      className="w-full text-center px-4 py-2 bg-cta-yellow text-oboe-black rounded-full text-sm font-bold hover:bg-chip-yellow transition-colors shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {payingBookingId === nextLesson.id ? "Initializing..." : "Pay Now to Confirm"}
                    </button>
                  ) : nextLesson.videoCallUrl ? (
                    <a 
                      href={nextLesson.videoCallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block text-center px-4 py-2 bg-white text-oboe-black rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                      Join Call
                    </a>
                  ) : (
                    <button 
                      onClick={() => toast.info("Meeting links will be generated closer to the session.")}
                      className="w-full text-center px-4 py-2 bg-white/50 text-oboe-black/50 rounded-full text-sm font-bold cursor-not-allowed"
                    >
                      Join Call (Pending)
                    </button>
                  )}
                  <Link href="/dashboard/schedule" className="inline-flex items-center gap-2 text-sm font-medium hover:text-cta-yellow transition-colors">
                    View Full Schedule <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                <p className="font-body text-sm text-gray-300 mb-6">You don&apos;t have any upcoming lessons scheduled.</p>
                <Link href="/dashboard/book" className="inline-block px-5 py-2 bg-cta-yellow text-oboe-black rounded-full text-sm font-bold border border-oboe-black hover:bg-chip-yellow transition-colors">
                  Book a Lesson
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
        </div>
      </div>

      <EquipmentTestModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} />
    </div>
  );
}
