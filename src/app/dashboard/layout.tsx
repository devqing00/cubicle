"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import HugeIcon from "@/components/ui/HugeIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import NotificationBell from "@/components/ui/NotificationBell";
import Logo from "@/components/ui/Logo";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isTutor = userData?.role === "tutor";

  // Role-based route protection
  React.useEffect(() => {
    if (!userData) return;

    const tutorOnlyRoutes = ["/dashboard/students", "/dashboard/availability"];
    const studentOnlyRoutes = ["/dashboard/book", "/dashboard/equipment", "/dashboard/history"];

    if (isTutor && studentOnlyRoutes.some(route => pathname.startsWith(route))) {
      toast.error("Access restricted: Booking & student features are reserved for student accounts.");
      router.replace("/dashboard");
    } else if (!isTutor && tutorOnlyRoutes.some(route => pathname.startsWith(route))) {
      toast.error("Access restricted: Instructor management controls are reserved for tutors.");
      router.replace("/dashboard");
    }
  }, [userData, isTutor, pathname, router]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut(auth);
      toast.success("Successfully signed out.");
      setShowSignOutModal(false);
      router.push("/login");
    } catch (err) {
      toast.error("Failed to sign out.");
    } finally {
      setSigningOut(false);
    }
  };

  const navItems = isTutor
    ? [
        { name: "Overview", href: "/dashboard", icon: "home" as const },
        { name: "Students", href: "/dashboard/students", icon: "users" as const },
        { name: "Schedule", href: "/dashboard/schedule", icon: "calendar" as const },
        { name: "Messages", href: "/dashboard/chat", icon: "comment" as const },
        { name: "Resources", href: "/dashboard/resources", icon: "book-open" as const },
        { name: "Availability", href: "/dashboard/availability", icon: "clock" as const },
        { name: "Settings", href: "/dashboard/settings", icon: "settings" as const },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: "home" as const },
        { name: "Book Session", href: "/dashboard/book", icon: "calendar" as const },
        { name: "My Schedule", href: "/dashboard/schedule", icon: "clock" as const },
        { name: "Messages", href: "/dashboard/chat", icon: "comment" as const },
        { name: "Resources", href: "/dashboard/resources", icon: "book-open" as const },
        { name: "Lesson History", href: "/dashboard/history", icon: "legal" as const },
        { name: "Equipment Test", href: "/dashboard/equipment", icon: "video" as const },
        { name: "Settings", href: "/dashboard/settings", icon: "settings" as const },
      ];

  // Auto-collapse sidebar on tablet screen resize (< 1024px)
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex relative">
      {/* Dark Overlay Backdrop when Sidebar is Expanded on Tablet Screens */}
      {!collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="hidden md:block lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-border-light bg-white h-screen shrink-0 z-40 transition-all duration-300 overflow-hidden ${
          collapsed
            ? "w-[80px] sticky top-0"
            : "w-[260px] fixed lg:sticky top-0 left-0 shadow-2xl lg:shadow-none"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="h-[64px] shrink-0 px-5 flex items-center justify-between border-b border-border-light relative group">
            {collapsed ? (
              <div className="w-full flex items-center justify-center relative">
                <div className="group-hover:opacity-0 group-hover:scale-90 transition-all duration-200 pointer-events-auto">
                  <Logo variant="blue" showText={false} href="/dashboard" />
                </div>
                <button
                  onClick={() => setCollapsed(false)}
                  className="absolute inset-0 m-auto w-9 h-9 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 shadow-xs hover:bg-accent-blue hover:text-white"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <HugeIcon name="chevron-right" size={18} />
                </button>
              </div>
            ) : (
              <>
                <Logo variant="blue" size={24} showText={true} href="/dashboard" />
                <button
                  onClick={() => setCollapsed(true)}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors opacity-70 group-hover:opacity-100"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <HugeIcon name="chevron-left" size={18} />
                </button>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex ${collapsed ? "justify-center" : "justify-start"} items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-text-primary text-white shadow-xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                  title={item.name}
                >
                  <HugeIcon
                    name={item.icon}
                    size={18}
                    className={active ? "text-accent-blue" : "text-text-secondary"}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile & Sign Out Button (Sticky Bottom) */}
        <div className="p-4 border-t border-border-light space-y-2 shrink-0 bg-white">
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="font-heading text-xs font-bold text-text-primary truncate">
                {userData?.displayName || userData?.fullName || user?.displayName || "User"}
              </p>
              <p className="font-body text-[11px] text-text-secondary capitalize truncate">
                {userData?.role || "Student"}
              </p>
            </div>
          )}
          <button
            onClick={() => setShowSignOutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out"
            aria-label="Sign out of account"
          >
            <HugeIcon name="logout" size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex h-[64px] bg-white border-b border-border-light px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-text-subtle">
              {isTutor ? "Instructor Portal" : "Student Workspace"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-6 w-px bg-border-light" />
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              title="Profile Settings"
            >
              <div className="w-8 h-8 rounded-full bg-accent-blue/10 text-accent-blue font-heading font-bold text-xs flex items-center justify-center border border-accent-blue/20">
                {(userData?.displayName || userData?.fullName || user?.displayName || (isTutor ? "T" : "S")).charAt(0).toUpperCase()}
              </div>
              <span className="font-body text-xs font-semibold text-text-primary">
                {userData?.displayName || userData?.fullName || user?.displayName || (isTutor ? "Instructor" : "Student")}
              </span>
            </Link>
          </div>
        </header>

        {/* Mobile Floating Sticky Glass Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3 pointer-events-none md:hidden transition-all duration-300">
          <div className="w-full max-w-[1000px] pl-5 pr-3 pointer-events-auto bg-white/90 backdrop-blur-xl rounded-full h-[52px] flex items-center justify-between">
            <Logo variant="blue" size={24} href="/dashboard" />

            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                onClick={() => setShowSignOutModal(true)}
                className="p-1.5 rounded-full text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <HugeIcon name="logout" size={18} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                aria-label="Toggle menu"
              >
                <HugeIcon name={mobileOpen ? "cancel" : "menu"} size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Backdrop & Floating Dropdown Modal */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 md:hidden flex flex-col justify-start px-4 pt-20 pb-6 bg-black/40 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-2xl p-4 rounded-[28px] border border-border-light shadow-2xl space-y-1.5 z-50 animate-[aeBubblePop_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
            >
              <div className="px-4 py-2 border-b border-border-light/60 flex items-center justify-between mb-1">
                <span className="font-heading text-xs font-bold text-text-subtle uppercase tracking-wider">
                  {isTutor ? "Instructor Portal" : "Student Menu"}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-accent-blue/10 text-accent-blue rounded-full font-semibold capitalize">
                  {userData?.role || "Student"}
                </span>
              </div>

              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-semibold transition-all ${
                      active
                        ? "bg-text-primary text-white shadow-xs"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                    }`}
                  >
                    <HugeIcon name={item.icon} size={18} className={active ? "text-accent-blue" : "text-text-secondary"} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto pt-[76px] md:pt-10">{children}</main>
      </div>

      {/* Reusable Sign Out Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSignOutModal}
        title="Sign Out of Cubicle?"
        description="Are you sure you want to end your current session? You will need to log back in to access your dashboard."
        confirmText="Sign Out"
        cancelText="Stay Logged In"
        variant="danger"
        iconName="logout"
        loading={signingOut}
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutModal(false)}
      />
    </div>
  );
}
