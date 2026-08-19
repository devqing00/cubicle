"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import HugeIcon from "@/components/ui/HugeIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Link from "next/link";
import { toast } from "sonner";
import { sendAppNotification } from "@/lib/notifications";
import PhoneInput from "@/components/ui/PhoneInput";

interface StudentUser {
  uid: string;
  email: string;
  displayName?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  targetLanguage?: string;
  experienceLevel?: string;
  level?: string;
  learningGoal?: string;
  learningGoals?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  tutorNotes?: string;
  status?: "active" | "inactive" | "onboarding";
  createdAt?: string;
  totalBookings?: number;
  completedBookings?: number;
  totalSpent?: number;
}

interface StudentBooking {
  id: string;
  studentId: string;
  reference: string;
  tier: string;
  scheduledDate?: string;
  scheduledTime?: string;
  formattedSchedule?: string;
  status: "confirmed" | "paid" | "completed" | "cancelled" | "pending_payment";
  meetLink?: string;
  createdAt: string;
}

export default function StudentsManagementPage() {
  const { user, userData, loading: authLoading } = useAuth();

  const [students, setStudents] = useState<StudentUser[]>([]);
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Active Modals
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<StudentUser | null>(null);
  const [selectedStudentForNotes, setSelectedStudentForNotes] = useState<StudentUser | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Edit Student Profile State
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<StudentUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTargetLang, setEditTargetLang] = useState("Spanish");
  const [editLevel, setEditLevel] = useState("Beginner");
  const [editGoal, setEditGoal] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Student State
  const [studentToDelete, setStudentToDelete] = useState<StudentUser | null>(null);
  const [deletingStudent, setDeletingStudent] = useState(false);

  // Manual Booking Modal
  const [selectedStudentForBooking, setSelectedStudentForBooking] = useState<StudentUser | null>(null);
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("10:00");
  const [manualTier, setManualTier] = useState<"trial" | "standard" | "intensive">("standard");
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Fetch all users with role 'student' and all bookings
  useEffect(() => {
    if (!user || userData?.role !== "tutor") return;

    // 1. Listen to students
    const usersQuery = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(
      usersQuery,
      (snapshot) => {
        const fetchedUsers = snapshot.docs
          .map((docSnap) => ({
            uid: docSnap.id,
            ...docSnap.data(),
          }))
          .filter((u: any) => u.role !== "tutor") as StudentUser[];

        setStudents(fetchedUsers);
      },
      (err) => {
        console.warn("Firestore users listener warning:", err);
      }
    );

    // 2. Listen to all bookings
    const bookingsQuery = query(collection(db, "bookings"));
    const unsubscribeBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const fetchedBookings = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as StudentBooking[];

        setBookings(fetchedBookings);
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore bookings listener warning:", err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeBookings();
    };
  }, [user, userData]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[450px] flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading student directory...</span>
        </div>
      </div>
    );
  }

  // Cross-reference students with bookings stats
  const enrichedStudents = students.map((student) => {
    const studentBookings = bookings.filter((b) => b.studentId === student.uid);
    const completed = studentBookings.filter((b) => b.status === "completed").length;
    const totalSpent = studentBookings.reduce((sum, b) => {
      if (b.status === "paid" || b.status === "completed") {
        return sum + (b.tier === "standard" ? 15000 : b.tier === "intensive" ? 25000 : 0);
      }
      return sum;
    }, 0);

    return {
      ...student,
      totalBookings: studentBookings.length,
      completedBookings: completed,
      totalSpent,
    };
  });

  // KPI Metrics Calculations
  const totalStudentsCount = enrichedStudents.length;
  const activeLearnersCount = enrichedStudents.filter((s) => (s.totalBookings || 0) > 0).length;
  const totalCompletedLessons = bookings.filter((b) => b.status === "completed").length;
  const totalPlatformRevenue = bookings.reduce((sum, b) => {
    if (b.status === "paid" || b.status === "completed") {
      return sum + (b.tier === "standard" ? 15000 : b.tier === "intensive" ? 25000 : 0);
    }
    return sum;
  }, 0);

  // Filtered List
  const filteredStudents = enrichedStudents.filter((s) => {
    const name = (s.displayName || s.fullName || s.firstName || "").toLowerCase();
    const email = (s.email || "").toLowerCase();
    const queryMatch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());

    const langMatch =
      languageFilter === "all" || (s.targetLanguage || "").toLowerCase() === languageFilter.toLowerCase();

    const statMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && (s.totalBookings || 0) > 0) ||
      (statusFilter === "new" && (s.totalBookings || 0) === 0);

    return queryMatch && langMatch && statMatch;
  });

  // Open Edit Modal
  const openEditModal = (student: StudentUser) => {
    setSelectedStudentForEdit(student);
    setEditName(student.displayName || student.fullName || student.firstName || "");
    setEditEmail(student.email || "");
    setEditTargetLang(student.targetLanguage || "Spanish");
    setEditLevel(student.experienceLevel || student.level || "Beginner (A1)");
    setEditGoal(student.learningGoal || student.learningGoals || "");
    setEditPhone(student.whatsapp || student.whatsappNumber || student.phoneNumber || "");
  };

  // Handle Save Edit Student
  const handleSaveEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForEdit) return;

    setSavingEdit(true);
    try {
      const studentRef = doc(db, "users", selectedStudentForEdit.uid);
      await updateDoc(studentRef, {
        displayName: editName,
        fullName: editName,
        email: editEmail,
        targetLanguage: editTargetLang,
        experienceLevel: editLevel,
        level: editLevel,
        learningGoal: editGoal,
        learningGoals: editGoal,
        whatsapp: editPhone,
        whatsappNumber: editPhone,
        phoneNumber: editPhone,
        updatedAt: new Date().toISOString(),
      });

      // Send notification to student about their profile update
      await sendAppNotification({
        userId: selectedStudentForEdit.uid,
        title: "Profile Updated",
        message: "Your learning profile details have been updated by your instructor.",
        type: "system",
        link: "/dashboard",
      });

      toast.success("Student profile updated successfully!");
      setSelectedStudentForEdit(null);
    } catch (err: unknown) {
      console.error("Failed to update student profile:", err);
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Confirm Delete Student
  const handleConfirmDeleteStudent = async () => {
    if (!studentToDelete) return;

    setDeletingStudent(true);
    try {
      const res = await fetch("/api/tutor/students/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: studentToDelete.uid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete student");

      toast.success(`Student ${studentToDelete.displayName || "account"} deleted. Financial audit logs preserved.`);
      setStudentToDelete(null);
    } catch (err: unknown) {
      console.error("Failed to delete student:", err);
      const msg = err instanceof Error ? err.message : "Failed to delete student record.";
      toast.error(msg);
    } finally {
      setDeletingStudent(false);
    }
  };

  // Handle Save Tutor Notes
  const handleSaveNotes = async () => {
    if (!selectedStudentForNotes) return;
    setSavingNotes(true);
    try {
      const studentRef = doc(db, "users", selectedStudentForNotes.uid);
      await updateDoc(studentRef, {
        tutorNotes: notesInput,
      });
      toast.success("Learning notes saved successfully!");
      setSelectedStudentForNotes(null);
    } catch (err) {
      console.error("Failed to save notes:", err);
      toast.error("Failed to save learning notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  // Handle Manual Booking Creation
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForBooking || !manualDate || !manualTime) return;

    setCreatingBooking(true);
    try {
      const array = new Uint8Array(3);
      window.crypto.getRandomValues(array);
      const hex = Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
      const ref = `CUB-${hex}`;

      // Call API to provision genuine Cal.com Google Meet room
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentForBooking.uid,
          studentName: selectedStudentForBooking.displayName || selectedStudentForBooking.fullName || "Student",
          studentEmail: selectedStudentForBooking.email,
          tier: manualTier,
          scheduledDate: manualDate,
          scheduledTime: manualTime,
          formattedSchedule: `${manualDate} at ${manualTime}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create booking");
      }

      // Notify the student of their newly scheduled session
      await sendAppNotification({
        userId: selectedStudentForBooking.uid,
        title: "New Lesson Scheduled",
        message: `Your instructor scheduled a ${manualTier} session for ${manualDate} at ${manualTime}. Ref: ${ref}`,
        type: "booking",
        link: "/dashboard/schedule",
      });

      toast.success(`Lesson scheduled successfully for ${selectedStudentForBooking.displayName || "Student"}!`);
      setSelectedStudentForBooking(null);
    } catch (err: unknown) {
      console.error("Failed to create manual booking:", err);
      const msg = err instanceof Error ? err.message : "Failed to create booking";
      toast.error(msg);
    } finally {
      setCreatingBooking(false);
    }
  };

  const studentBookingsList = selectedStudentForHistory
    ? bookings.filter((b) => b.studentId === selectedStudentForHistory.uid)
    : [];

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-2 inline-block">
            Tutor Administration
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Student & User Management
          </h1>
          <p className="font-body text-xs sm:text-sm text-text-secondary mt-1">
            Track student learning goals, edit profiles, monitor lesson progress, write notes, and schedule sessions.
          </p>
        </div>

        <Link
          href="/dashboard/chat"
          className="px-5 py-2.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <HugeIcon name="comment" size={16} />
          <span>Open Messages</span>
        </Link>
      </div>

      {/* KPI Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-3">
            <HugeIcon name="users" size={20} />
          </div>
          <p className="font-heading text-2xl font-bold text-text-primary">{totalStudentsCount}</p>
          <p className="font-body text-xs text-text-secondary mt-0.5">Total Enrolled Students</p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-200">
            <HugeIcon name="sparkles" size={20} />
          </div>
          <p className="font-heading text-2xl font-bold text-text-primary">{activeLearnersCount}</p>
          <p className="font-body text-xs text-text-secondary mt-0.5">Active Learners</p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 border border-amber-200">
            <HugeIcon name="clock" size={20} />
          </div>
          <p className="font-heading text-2xl font-bold text-text-primary">{totalCompletedLessons}</p>
          <p className="font-body text-xs text-text-secondary mt-0.5">Lessons Completed</p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 border border-purple-200">
            <HugeIcon name="tag" size={20} />
          </div>
          <p className="font-heading text-2xl font-bold text-text-primary">₦{totalPlatformRevenue.toLocaleString()}</p>
          <p className="font-body text-xs text-text-secondary mt-0.5">Student Lifetime Spend</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-[24px] border border-border-light shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-4 pr-4 py-2.5 rounded-full border border-border-light bg-surface-near-white text-xs font-body text-text-primary placeholder:text-text-subtle focus:border-accent-blue transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
          >
            <option value="all">All Languages</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="english">Business English</option>
            <option value="german">German</option>
            <option value="mandarin">Mandarin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
          >
            <option value="all">All Activity</option>
            <option value="active">Active Learners</option>
            <option value="new">New Registrations</option>
          </select>
        </div>
      </div>

      {/* Student Directory Table / Grid */}
      <div className="bg-white rounded-[28px] border border-border-light shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto mb-3 text-text-subtle">
              <HugeIcon name="users" size={28} />
            </div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">No students found</h3>
            <p className="font-body text-xs text-text-secondary max-w-sm mx-auto">
              No registered students match your current search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light bg-surface-near-white/60 text-[11px] font-heading font-bold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-4">Language Track</th>
                  <th className="py-4 px-4">Level & Goal</th>
                  <th className="py-4 px-4">Sessions</th>
                  <th className="py-4 px-4">Total Paid</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs font-body">
                {filteredStudents.map((student) => {
                  const studentName =
                    student.displayName || student.fullName || student.firstName || "Student Learner";
                  const initial = studentName.charAt(0).toUpperCase();
                  const targetLang = student.targetLanguage || "General";
                  const level = student.experienceLevel || "Beginner";
                  const totalSpent = student.totalSpent || 0;

                  return (
                    <tr key={student.uid} className="hover:bg-surface-near-white/50 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 flex items-center justify-center font-heading font-bold text-xs shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-heading font-bold text-xs text-text-primary">{studentName}</p>
                            <p className="font-body text-[11px] text-text-secondary">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Language Track */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                          {targetLang}
                        </span>
                      </td>

                      {/* Level & Goal */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-text-primary capitalize">{level}</p>
                        <p className="text-[11px] text-text-secondary truncate max-w-[160px]">
                          {student.learningGoal || "Conversational fluency"}
                        </p>
                      </td>

                      {/* Sessions count */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-text-primary">
                          {student.completedBookings || 0} / {student.totalBookings || 0}
                        </span>
                        <p className="text-[10px] text-text-secondary">Completed / Booked</p>
                      </td>

                      {/* Total Paid */}
                      <td className="py-4 px-4 font-heading font-bold text-text-primary">
                        ₦{totalSpent.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* In-App Chat */}
                          <Link
                            href="/dashboard/chat"
                            className="p-2 rounded-full hover:bg-surface-muted text-text-secondary hover:text-accent-blue transition-colors"
                            title="Chat with Student"
                          >
                            <HugeIcon name="comment" size={16} />
                          </Link>

                          {/* Edit Student Profile */}
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-2 rounded-full hover:bg-surface-muted text-text-secondary hover:text-accent-blue transition-colors"
                            title="Edit Student Profile"
                          >
                            <HugeIcon name="edit" size={16} />
                          </button>

                          {/* Private Notes */}
                          <button
                            onClick={() => {
                              setSelectedStudentForNotes(student);
                              setNotesInput(student.tutorNotes || "");
                            }}
                            className="p-2 rounded-full hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors"
                            title="Tutor Learning Notes"
                          >
                            <HugeIcon name="brain" size={16} />
                          </button>

                          {/* View Booking History */}
                          <button
                            onClick={() => setSelectedStudentForHistory(student)}
                            className="p-2 rounded-full hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors"
                            title="Session History"
                          >
                            <HugeIcon name="calendar" size={16} />
                          </button>

                          {/* Schedule Lesson on behalf */}
                          <button
                            onClick={() => {
                              setSelectedStudentForBooking(student);
                              setManualDate(new Date().toISOString().split("T")[0]);
                            }}
                            className="px-2.5 py-1 bg-surface-muted hover:bg-text-primary hover:text-white rounded-full text-[11px] font-semibold text-text-primary transition-colors"
                            title="Schedule on behalf"
                          >
                            + Schedule
                          </button>

                          {/* Delete Student */}
                          <button
                            onClick={() => setStudentToDelete(student)}
                            className="p-2 rounded-full hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors"
                            title="Delete Student Record"
                          >
                            <HugeIcon name="trash" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Edit Student Profile Modal */}
      {selectedStudentForEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditStudent}
            className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 border border-border-light shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border-light pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Edit Student Profile
                </h3>
                <p className="font-body text-xs text-text-secondary">
                  Update learning objectives, contact information, and language track.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForEdit(null)}
                className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
              >
                <HugeIcon name="cancel" size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-body">
              <div>
                <label className="block font-semibold text-text-primary mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Target Language</label>
                  <select
                    value={editTargetLang}
                    onChange={(e) => setEditTargetLang(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="English">Business English</option>
                    <option value="German">German</option>
                    <option value="Mandarin">Mandarin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Proficiency Level</label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
                  >
                    <option value="Beginner">Beginner (A1)</option>
                    <option value="Elementary">Elementary (A2)</option>
                    <option value="Intermediate">Intermediate (B1)</option>
                    <option value="Upper Intermediate">Upper Intermediate (B2)</option>
                    <option value="Advanced">Advanced (C1-C2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">WhatsApp / Phone Number</label>
                <PhoneInput
                  id="edit-student-phone"
                  value={editPhone}
                  onChange={setEditPhone}
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Primary Learning Goal</label>
                <input
                  type="text"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  placeholder="e.g. Pass DELE B2 Exam or Career relocation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
              <button
                type="button"
                onClick={() => setSelectedStudentForEdit(null)}
                className="px-4 py-2 rounded-full border border-border-light text-xs font-semibold text-text-secondary hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-5 py-2 rounded-full bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Tutor Private Notes Editor */}
      {selectedStudentForNotes && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 border border-border-light shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-light pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Learning Notes for {selectedStudentForNotes.displayName || "Student"}
                </h3>
                <p className="font-body text-xs text-text-secondary">
                  Private pedagogical notes, weaknesses, homework assignments, and CEFR progress.
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForNotes(null)}
                className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
              >
                <HugeIcon name="cancel" size={18} />
              </button>
            </div>

            <textarea
              rows={6}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. Needs extra practice on Spanish Subjunctive triggers. Strong vocabulary in travel contexts. Recommended homework: Chapter 4 reading."
              className="w-full p-4 rounded-2xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary placeholder:text-text-subtle focus:border-accent-blue transition-colors"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedStudentForNotes(null)}
                className="px-4 py-2 rounded-full border border-border-light text-xs font-semibold text-text-secondary hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-5 py-2 rounded-full bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Student Session History Inspector */}
      {selectedStudentForHistory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 border border-border-light shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border-light pb-4 shrink-0">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Booking History: {selectedStudentForHistory.displayName || "Student"}
                </h3>
                <p className="font-body text-xs text-text-secondary">
                  {studentBookingsList.length} total sessions on record.
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
              >
                <HugeIcon name="cancel" size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {studentBookingsList.length === 0 ? (
                <p className="text-center py-8 text-xs text-text-secondary">
                  No session bookings recorded for this student yet.
                </p>
              ) : (
                studentBookingsList.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-surface-near-white rounded-2xl border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-xs text-text-primary capitalize">
                          {b.tier} Session
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border ${
                            b.status === "confirmed" || b.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : b.status === "completed"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {b.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-1">
                        Ref: <span className="font-mono">{b.reference}</span> • Scheduled:{" "}
                        {b.formattedSchedule || b.scheduledDate || "N/A"}
                      </p>
                    </div>

                    {b.meetLink && (
                      <a
                        href={b.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-text-primary text-white rounded-full text-xs font-semibold hover:bg-black transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1"
                      >
                        <HugeIcon name="sparkles" size={12} />
                        <span>Meeting Room</span>
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border-light pt-4 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="px-5 py-2 bg-surface-muted text-text-primary rounded-full text-xs font-semibold hover:bg-surface-near-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Manual Lesson Scheduling */}
      {selectedStudentForBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateManualBooking}
            className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-border-light shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border-light pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Schedule Lesson for {selectedStudentForBooking.displayName || "Student"}
                </h3>
                <p className="font-body text-xs text-text-secondary">
                  Create an official booking and provision Google Meet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForBooking(null)}
                className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
              >
                <HugeIcon name="cancel" size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Lesson Tier</label>
                <select
                  value={manualTier}
                  onChange={(e) => setManualTier(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-border-light text-xs font-semibold bg-white text-text-primary focus:border-accent-blue"
                >
                  <option value="trial">Free Trial (30 mins • ₦0)</option>
                  <option value="standard">Standard Lesson (60 mins • ₦15,000)</option>
                  <option value="intensive">Intensive Lesson (90 mins • ₦25,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border-light text-xs font-body bg-white text-text-primary focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Time Slot</label>
                <input
                  type="time"
                  required
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border-light text-xs font-body bg-white text-text-primary focus:border-accent-blue"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
              <button
                type="button"
                onClick={() => setSelectedStudentForBooking(null)}
                className="px-4 py-2 rounded-full border border-border-light text-xs font-semibold text-text-secondary hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingBooking}
                className="px-5 py-2 rounded-full bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
              >
                {creatingBooking ? "Creating..." : "Confirm & Schedule"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal for Student Deletion */}
      <ConfirmationModal
        isOpen={Boolean(studentToDelete)}
        title={`Delete student "${studentToDelete?.displayName || "account"}"?`}
        description="This will permanently delete this student record and all associated booking data. This action cannot be undone."
        confirmText="Delete Student"
        cancelText="Keep Student"
        variant="danger"
        iconName="trash"
        loading={deletingStudent}
        onConfirm={handleConfirmDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
}
