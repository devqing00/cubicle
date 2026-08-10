"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Booking {
  id: string;
  studentId: string;
  reference: string;
  tier: string;
  status: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { userData, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (authLoading) return <div className="animate-pulse">Loading history...</div>;

  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="w-full">
      <h1 className="font-heading text-4xl font-bold text-oboe-black mb-8">Lesson History</h1>
      
      <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm min-h-[400px]">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center justify-center h-full gap-4 pt-12">
            <div className="w-8 h-8 border-4 border-cta-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pastBookings.length === 0 ? (
          <div className="text-center pt-12">
            <h3 className="font-heading text-lg font-semibold text-oboe-black mb-1">No past lessons</h3>
            <p className="font-body text-sm text-mid-gray-brown">Completed and cancelled lessons will appear here.</p>
          </div>
        ) : (
          <div className="w-full h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm">
                <thead className="border-b border-border-warm text-mid-gray-brown">
                  <tr>
                    <th className="pb-3 font-semibold">Date</th>
                    {userData?.role === "tutor" && <th className="pb-3 font-semibold">Student ID</th>}
                    <th className="pb-3 font-semibold">Tier</th>
                    <th className="pb-3 font-semibold">Reference</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastBookings.map((lesson) => (
                    <tr key={lesson.id} className="border-b border-border-warm/50 last:border-0 hover:bg-surface-base/50 transition-colors">
                      <td className="py-4 text-dark-charcoal">
                        {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      {userData?.role === "tutor" && (
                        <td className="py-4 text-mid-gray-brown font-mono">
                          {lesson.studentId?.substring(0, 8) || "Unknown"}...
                        </td>
                      )}
                      <td className="py-4 text-dark-charcoal capitalize">
                        {lesson.tier}
                      </td>
                      <td className="py-4 text-mid-gray-brown font-mono">
                        {lesson.reference || "N/A"}
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                          lesson.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {lesson.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
