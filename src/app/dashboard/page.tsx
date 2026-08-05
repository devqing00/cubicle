"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-body text-mid-gray-brown bg-surface-base">Loading your dashboard...</div>;
  }

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface-base p-6 md:p-12 pt-32">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border-warm pb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-oboe-black mb-2">Welcome back, {user.displayName || user.email?.split("@")[0]}</h1>
            <p className="font-body text-mid-gray-brown">Manage your lessons and account settings here.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 bg-white border border-border-warm text-dark-charcoal rounded-full font-body font-medium hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
          >
            Log out
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-brutal min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-semibold text-oboe-black mb-3">No upcoming lessons</h2>
            <p className="font-body text-mid-gray-brown">You haven't scheduled any tutoring sessions yet.</p>
            <button className="mt-6 px-6 py-2.5 bg-cta-yellow text-oboe-black rounded-full font-body font-medium border border-border-warm shadow-sm hover:bg-chip-yellow transition-colors">
              Book your first lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
