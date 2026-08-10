"use client";

import { useAuth } from "@/lib/AuthContext";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TutorDashboard from "@/components/dashboard/TutorDashboard";

export default function DashboardOverviewPage() {
  const { userData, loading } = useAuth();

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cta-yellow border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body text-mid-gray-brown">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (userData.role === "tutor") {
    return <TutorDashboard userData={userData} />;
  }

  return <StudentDashboard userData={userData} />;
}
