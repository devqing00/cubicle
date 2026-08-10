"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
  VideoCameraIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  // Protect the entire dashboard
  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/dashboard");
      } else if (userData && !userData.onboardingComplete && userData.role !== "tutor") {
        router.push("/onboarding");
      }
    }
  }, [user, userData, loading, router]);

  if (loading || !user || !userData) {
    return <div className="min-h-screen bg-surface-base flex items-center justify-center font-body text-mid-gray-brown">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const isTutor = userData.role === "tutor";

  const tutorLinks = [
    { name: "Overview", href: "/dashboard", icon: HomeIcon },
    { name: "My Schedule", href: "/dashboard/schedule", icon: CalendarDaysIcon },
    { name: "Availability", href: "/dashboard/availability", icon: ClockIcon },
    { name: "History", href: "/dashboard/history", icon: BookOpenIcon },
  ];

  const studentLinks = [
    { name: "Overview", href: "/dashboard", icon: HomeIcon },
    { name: "Book a Lesson", href: "/dashboard/book", icon: CalendarDaysIcon },
    { name: "Upcoming", href: "/dashboard/schedule", icon: ClockIcon },
    { name: "History", href: "/dashboard/history", icon: BookOpenIcon },
    { name: "Browse Subjects", href: "/dashboard/subjects", icon: AcademicCapIcon },
    { name: "Test Equipment", href: "/dashboard/equipment", icon: VideoCameraIcon },
  ];

  const navLinks = isTutor ? tutorLinks : studentLinks;

  return (
    <div className="min-h-screen bg-surface-base flex font-body">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-oboe-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-border-warm transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isSidebarCollapsed ? "w-20" : "w-64"} flex flex-col`}
      >
        <div className={`p-6 flex items-center justify-between border-b border-border-warm ${isSidebarCollapsed ? 'flex-col gap-4 justify-center' : ''}`}>
          {!isSidebarCollapsed && (
            <Link href="/" className="font-heading font-bold text-2xl tracking-tighter text-oboe-black hover:text-dark-charcoal transition-colors">
              Cubicle.
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/" className="font-heading font-bold text-xl tracking-tighter text-oboe-black hover:text-dark-charcoal transition-colors">
              C.
            </Link>
          )}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-mid-gray-brown hover:text-oboe-black">
            <XMarkIcon className="w-6 h-6" />
          </button>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden lg:block text-mid-gray-brown hover:text-oboe-black bg-surface-base hover:bg-border-warm p-1.5 rounded-md transition-colors">
            {isSidebarCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isSidebarCollapsed ? "justify-center" : ""
                } ${
                  isActive 
                    ? "bg-oboe-black text-white" 
                    : "text-mid-gray-brown hover:bg-surface-base hover:text-dark-charcoal"
                }`}
                title={isSidebarCollapsed ? link.name : undefined}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-mid-gray-brown"}`} />
                {!isSidebarCollapsed && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-warm">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-red-600 hover:bg-red-50 ${isSidebarCollapsed ? "justify-center" : ""}`}
            title={isSidebarCollapsed ? "Log Out" : undefined}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-border-warm px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <Link href="/" className="font-heading font-bold text-xl tracking-tighter text-oboe-black">
            Cubicle.
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-dark-charcoal p-1 rounded-md hover:bg-surface-base transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
