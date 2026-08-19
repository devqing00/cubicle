"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  orderBy,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import HugeIcon from "@/components/ui/HugeIcon";
import Link from "next/link";
import { toast } from "sonner";
import { sendAppNotification } from "@/lib/notifications";

interface Message {
  id?: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "tutor";
  text: string;
  createdAt: any;
}

interface ChatThread {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  tutorId: string;
  tutorName: string;
  lastMessage?: string;
  lastMessageTime?: any;
  archived?: boolean;
  isDeletedStudent?: boolean;
}

export default function ChatPage() {
  const { user, userData, loading: authLoading } = useAuth();
  
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatTab, setChatTab] = useState<"active" | "archived">("active");
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showMobileChatWindow, setShowMobileChatWindow] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isTutor = userData?.role === "tutor";
  const tutorWhatsAppNumber = (process.env.NEXT_PUBLIC_TUTOR_WHATSAPP || "2348000000000").replace(/[^0-9]/g, '');

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load threads
  useEffect(() => {
    if (!user || !userData) return;

    if (isTutor) {
      // Tutor sees all chat threads or student bookings
      const q = query(collection(db, "chats"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ChatThread[];

          setThreads(fetched);
        },
        (error) => {
          console.warn("Chat threads snapshot error (check Firestore Security Rules):", error);
        }
      );
      return () => unsubscribe();
    } else {
      // Student: Default single thread with main instructor
      const studentChatId = `chat_${user.uid}`;
      setActiveThreadId(studentChatId);

      // Ensure thread document exists in Firestore
      const threadRef = doc(db, "chats", studentChatId);
      setDoc(threadRef, {
        id: studentChatId,
        studentId: user.uid,
        studentName: userData.displayName || userData.fullName || user.displayName || "Student",
        studentEmail: user.email || "",
        tutorId: "tutor_cubicle",
        tutorName: "Certified Instructor",
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch((err) => {
        console.warn("Thread init catch (check Firestore Security Rules):", err);
      });
    }
  }, [user, userData, isTutor]);

  // Filter threads by active tab & search
  const activeThreads = threads.filter(t => !t.archived);
  const archivedThreads = threads.filter(t => Boolean(t.archived));
  const currentTabThreads = chatTab === "active" ? activeThreads : archivedThreads;

  const filteredThreads = currentTabThreads.filter(t => 
    t.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.studentEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-select first thread in active tab if current selection is invalid
  useEffect(() => {
    if (isTutor) {
      const isCurrentInTab = filteredThreads.some(t => t.id === activeThreadId);
      if (!isCurrentInTab) {
        if (filteredThreads.length > 0) {
          setActiveThreadId(filteredThreads[0].id);
        } else {
          setActiveThreadId(null);
        }
      }
    }
  }, [chatTab, threads, isTutor]);

  // Listen to messages for the active thread
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, "chats", activeThreadId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(msgs);
      },
      (error) => {
        console.warn("Messages stream snapshot error (check Firestore Security Rules):", error);
      }
    );

    return () => unsubscribe();
  }, [activeThreadId]);

  const handleToggleArchive = async (threadId: string, isCurrentlyArchived: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/tutor/chat/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, archived: !isCurrentlyArchived }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update thread archive state");

      toast.success(!isCurrentlyArchived ? "Thread moved to Archived tab" : "Thread restored to Active Messages");
    } catch (err: any) {
      toast.error(err.message || "Failed to update thread");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePermanently = async () => {
    if (!activeThreadId) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/tutor/chat/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: activeThreadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete thread");

      toast.success("Chat thread and message history permanently deleted!");
      setDeleteConfirmOpen(false);
      setActiveThreadId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete thread");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeThreadId) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const senderName = userData?.displayName || userData?.fullName || user.displayName || (isTutor ? "Instructor" : "Student");
      const senderRole = isTutor ? "tutor" : "student";

      // 1. Add to messages subcollection
      await addDoc(collection(db, "chats", activeThreadId, "messages"), {
        senderId: user.uid,
        senderName,
        senderRole,
        text: messageText,
        createdAt: new Date().toISOString(),
      });

      // 2. Update thread lastMessage & timestamp
      await setDoc(doc(db, "chats", activeThreadId), {
        lastMessage: messageText,
        lastMessageTime: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 3. Dispatch in-app notification to recipient
      const recipientId = isTutor
        ? activeThread?.studentId || activeThreadId.replace("chat_", "")
        : "tutor_cubicle";

      await sendAppNotification({
        userId: recipientId,
        title: `New message from ${senderName}`,
        message: messageText.length > 80 ? `${messageText.slice(0, 80)}...` : messageText,
        type: "chat",
        link: "/dashboard/chat",
      });

    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !user || !userData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading chat...</span>
        </div>
      </div>
    );
  }

  const activeThread = threads.find(t => t.id === activeThreadId);
  const recipientName = isTutor 
    ? (activeThread?.studentName || "Student")
    : "Certified Language Instructor";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-2 inline-block">
            Real-Time Messages
          </span>
          <h1 className="font-heading text-3xl font-bold text-text-primary tracking-tight">
            {isTutor ? "Student Inquiries & Messages" : "Chat with your Instructor"}
          </h1>
        </div>

        {/* Direct WhatsApp Action */}
        {!isTutor && (
          <a
            href={`https://wa.me/${tutorWhatsAppNumber}?text=${encodeURIComponent("Hi! I'm reaching out from Cubicle regarding my lessons.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-full font-body text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-all self-start sm:self-auto"
          >
            <HugeIcon name="comment" size={16} />
            <span>Open in WhatsApp</span>
          </a>
        )}
      </div>

      {/* Main Chat Canvas */}
      <div className="bg-white rounded-[28px] border border-border-light shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] max-h-[75vh]">
        
        {/* Left: Tutor Student Thread List (Only shown for Tutor) */}
        {isTutor && (
          <div className={`md:col-span-4 border-r border-border-light flex flex-col h-full bg-surface-near-white ${
            showMobileChatWindow ? "hidden md:flex" : "flex"
          }`}>
            
            {/* Active vs Archived Tab Controls */}
            <div className="p-3 border-b border-border-light flex items-center justify-between gap-1 bg-white">
              <button
                onClick={() => setChatTab("active")}
                className={`flex-1 py-1.5 px-3 rounded-xl font-body text-xs font-semibold transition-all ${
                  chatTab === "active"
                    ? "bg-accent-blue text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-near-white"
                }`}
              >
                Active ({activeThreads.length})
              </button>
              <button
                onClick={() => setChatTab("archived")}
                className={`flex-1 py-1.5 px-3 rounded-xl font-body text-xs font-semibold transition-all ${
                  chatTab === "archived"
                    ? "bg-accent-blue text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-near-white"
                }`}
              >
                Archived ({archivedThreads.length})
              </button>
            </div>

            <div className="p-3 border-b border-border-light">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full px-3 py-2 rounded-xl border border-border-light bg-white font-body text-xs text-text-primary placeholder:text-text-subtle focus:border-accent-blue transition-colors"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border-light">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-text-secondary text-xs">
                  {chatTab === "active" ? "No active student conversations." : "No archived or deleted student conversations."}
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isActive = thread.id === activeThreadId;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => {
                        setActiveThreadId(thread.id);
                        setShowMobileChatWindow(true);
                      }}
                      className={`w-full p-4 text-left transition-colors flex items-center gap-3 ${
                        isActive ? "bg-white border-l-4 border-l-accent-blue shadow-2xs" : "hover:bg-surface-muted"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center font-heading font-bold text-sm shrink-0">
                        {thread.studentName?.charAt(0) || "S"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-heading font-bold text-xs text-text-primary truncate">
                            {thread.studentName}
                          </p>
                          {thread.isDeletedStudent && (
                            <span className="px-1.5 py-0.5 bg-red-500/10 text-red-600 rounded text-[9px] font-bold uppercase shrink-0">
                              Deleted
                            </span>
                          )}
                        </div>
                        <p className="font-body text-[11px] text-text-secondary truncate mt-0.5">
                          {thread.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Right / Main: Chat Conversation Window */}
        <div className={`${isTutor ? "md:col-span-8" : "col-span-12"} flex flex-col h-full bg-white ${
          isTutor && !showMobileChatWindow ? "hidden md:flex" : "flex"
        }`}>
          
          {/* Thread Header */}
          <div className="px-6 py-4 border-b border-border-light flex items-center justify-between bg-surface-near-white shrink-0">
            <div className="flex items-center gap-3">
              {isTutor && (
                <button
                  type="button"
                  onClick={() => setShowMobileChatWindow(false)}
                  className="md:hidden px-2.5 py-1 text-text-secondary hover:text-text-primary rounded-xl bg-white border border-border-light flex items-center gap-1 font-body text-xs font-semibold shrink-0"
                >
                  <HugeIcon name="chevron-left" size={14} />
                  <span>Inbox</span>
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center font-heading font-bold text-sm shrink-0">
                {recipientName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-sm text-text-primary flex items-center gap-2 truncate">
                  <span className="truncate">{recipientName}</span>
                  {activeThread?.isDeletedStudent && (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded-full text-[10px] font-bold shrink-0">
                      Account Deleted
                    </span>
                  )}
                </h3>
                <p className="font-body text-[11px] text-text-secondary truncate">
                  {isTutor ? (activeThread?.archived ? "Archived Discussion Thread" : "Student Discussion Thread") : "Official Tutor Communication Channel"}
                </p>
              </div>
            </div>

            {/* Action Buttons for Tutor */}
            {isTutor && activeThread && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleArchive(activeThread.id, Boolean(activeThread.archived))}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-white border border-border-light rounded-xl font-body text-xs font-semibold text-text-secondary hover:text-accent-blue hover:border-accent-blue/30 transition-all flex items-center gap-1.5"
                  title={activeThread.archived ? "Move back to Active Messages" : "Archive Thread"}
                >
                  <HugeIcon name="archive" size={14} />
                  <span className="hidden sm:inline">{activeThread.archived ? "Unarchive" : "Archive"}</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-body text-xs font-semibold hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5"
                  title="Delete Thread Permanently"
                >
                  <HugeIcon name="trash" size={14} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            )}

            {!isTutor && (
              <Link
                href="/dashboard/schedule"
                className="text-xs font-semibold text-text-secondary hover:text-accent-blue flex items-center gap-1"
              >
                <HugeIcon name="calendar" size={14} />
                <span className="hidden sm:inline">View Schedule</span>
              </Link>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-surface-near-white/40">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-secondary">
                <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-3">
                  <HugeIcon name="comment" size={24} />
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">Start the Conversation</h4>
                <p className="font-body text-xs max-w-sm">
                  Send a message to ask about lesson preparation, homework, schedule adjustments, or learning materials.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.senderId === user.uid;
                return (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs font-body leading-relaxed shadow-2xs ${
                        isMine
                          ? "bg-accent-blue text-white rounded-br-xs"
                          : "bg-white text-text-primary border border-border-light rounded-bl-xs"
                      }`}
                    >
                      <p className="font-semibold text-[10px] opacity-75 mb-1">
                        {isMine ? "You" : msg.senderName}
                      </p>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-text-subtle mt-1 px-1">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer with Responsive Multi-Line Textarea */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border-light bg-white flex items-end gap-2 shrink-0">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
                if (e.key === "Enter") {
                  if (isDesktop) {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e as unknown as React.FormEvent);
                    }
                  }
                  // On Mobile & Tablet: Enter key creates a new line by default
                }
              }}
              placeholder="Type your message... (Shift+Enter for new line on desktop)"
              className="flex-1 px-4 py-3 rounded-2xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary placeholder:text-text-subtle focus:border-accent-blue transition-colors resize-none min-h-[44px] max-h-[120px]"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="px-5 py-3 bg-accent-blue text-white rounded-2xl font-body text-xs font-semibold hover:bg-accent-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs shrink-0 h-[44px]"
            >
              <span>Send</span>
              <HugeIcon name="arrow-right" size={14} />
            </button>
          </form>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] border border-border-light max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <HugeIcon name="trash" size={24} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                Delete Chat Thread Permanently?
              </h3>
              <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                Are you sure you want to delete this thread with <strong className="text-text-primary">{recipientName}</strong>? All message logs and history will be permanently erased. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2 bg-surface-near-white border border-border-light rounded-xl font-body text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePermanently}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-body text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
              >
                {actionLoading ? "Deleting..." : "Yes, Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
