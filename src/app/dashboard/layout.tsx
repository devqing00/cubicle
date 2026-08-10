"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import HugeIcon from "@/components/ui/HugeIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
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
        { name: "Schedule", href: "/dashboard/schedule", icon: "calendar" as const },
        { name: "Availability", href: "/dashboard/availability", icon: "clock" as const },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: "home" as const },
        { name: "Book Session", href: "/dashboard/book", icon: "calendar" as const },
        { name: "My Schedule", href: "/dashboard/schedule", icon: "clock" as const },
        { name: "Lesson History", href: "/dashboard/history", icon: "legal" as const },
      ];

  return (
    <div className="min-h-screen bg-surface-near-white font-body text-text-primary flex">
      {/* Desktop Sidebar (Fixed Full Height) */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-border-light bg-white sticky top-0 h-screen shrink-0 z-30 transition-all duration-300 overflow-hidden ${
          collapsed ? "w-[80px]" : "w-[260px]"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="h-[72px] shrink-0 px-6 flex items-center justify-between border-b border-border-light">
            {!collapsed && (
              <Link href="/" className="font-heading text-xl font-bold tracking-tight text-text-primary">
                Cubicle.
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <HugeIcon name={collapsed ? "chevron-right" : "chevron-left"} size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
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
        {/* Mobile Header */}
        <header className="md:hidden h-[64px] bg-white border-b border-border-light px-6 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl font-bold tracking-tight text-text-primary">
            Cubicle.
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSignOutModal(true)}
              className="p-2 rounded-xl text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <HugeIcon name="logout" size={20} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
            >
              <HugeIcon name={mobileOpen ? "cancel" : "menu"} size={22} />
            </button>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-border-light p-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-text-primary text-white"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <HugeIcon name={item.icon} size={18} className={active ? "text-accent-blue" : "text-text-secondary"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">{children}</main>
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
