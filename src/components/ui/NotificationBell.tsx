"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import HugeIcon from "@/components/ui/HugeIcon";
import { useRouter } from "next/navigation";
import { AppNotification } from "@/lib/notifications";

export default function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen to user's notifications in real-time
  useEffect(() => {
    if (!user) return;

    const notifQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      notifQuery,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as AppNotification[];

        // Sort in memory by createdAt descending
        fetched.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setNotifications(fetched);
      },
      (err) => {
        console.warn("Notification listener error:", err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification: AppNotification) => {
    // Mark as read in Firestore
    if (notification.id && !notification.read) {
      try {
        await updateDoc(doc(db, "notifications", notification.id), {
          read: true,
        });
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      const batch = writeBatch(db);
      notifications
        .filter((n) => !n.read && n.id)
        .forEach((n) => {
          batch.update(doc(db, "notifications", n.id!), { read: true });
        });
      await batch.commit();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    if (!isoString) return "Just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getIconForType = (type: AppNotification["type"]) => {
    switch (type) {
      case "booking":
        return <HugeIcon name="calendar" size={14} className="text-accent-blue" />;
      case "payment":
        return <HugeIcon name="tag" size={14} className="text-emerald-600" />;
      case "chat":
        return <HugeIcon name="comment" size={14} className="text-purple-600" />;
      case "reminder":
        return <HugeIcon name="clock" size={14} className="text-amber-600" />;
      default:
        return <HugeIcon name="sparkles" size={14} className="text-accent-blue" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <HugeIcon name="bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent-blue text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed sm:absolute left-1/2 sm:left-auto right-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 top-16 sm:top-auto mt-0 sm:mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 bg-white rounded-[24px] border border-border-light shadow-xl z-50 overflow-hidden flex flex-col font-body">
          {/* Dropdown Header */}
          <div className="px-5 py-4 border-b border-border-light flex items-center justify-between bg-surface-near-white/70 shrink-0">
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-bold text-sm text-text-primary">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-accent-blue hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border-light">
            {notifications.length === 0 ? (
              <div className="py-12 px-6 text-center text-text-secondary">
                <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-2 text-text-subtle">
                  <HugeIcon name="bell" size={18} />
                </div>
                <p className="font-heading font-bold text-xs text-text-primary">All caught up!</p>
                <p className="text-[11px] text-text-subtle mt-0.5">No notifications right now.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full p-4 text-left hover:bg-surface-near-white transition-colors flex items-start gap-3 ${
                    !notif.read ? "bg-accent-blue/5" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-heading font-bold text-xs text-text-primary truncate">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-text-subtle shrink-0">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-accent-blue shrink-0 self-center" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Dropdown Footer */}
          <div className="p-3 bg-surface-near-white border-t border-border-light text-center shrink-0">
            <span className="text-[11px] text-text-subtle font-medium">
              Cubicle Real-Time Alert Stream
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
