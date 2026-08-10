"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HugeIcon from "@/components/ui/HugeIcon";

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
          <span>Loading history...</span>
        </div>
      </div>
    );
  }

  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="w-full">
      <div className="mb-8 pb-6 border-b border-border-light">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">Lesson History</h1>
        <p className="font-body text-xs md:text-sm text-text-secondary mt-1">Review past completed sessions and archive logs.</p>
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
            <p className="font-body text-xs text-text-secondary">Completed and cancelled lessons will appear here.</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="border-b border-border-light text-text-secondary uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="pb-3 font-semibold">Date</th>
                    {userData?.role === "tutor" && <th className="pb-3 font-semibold">Student ID</th>}
                    <th className="pb-3 font-semibold">Tier</th>
                    <th className="pb-3 font-semibold">Reference</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light/60">
                  {pastBookings.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-surface-near-white/60 transition-colors">
                      <td className="py-4 text-text-primary font-medium">
                        {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      {userData?.role === "tutor" && (
                        <td className="py-4 text-text-secondary font-mono">
                          {lesson.studentId?.substring(0, 8) || "Unknown"}...
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
                          lesson.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
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
