"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import HugeIcon from "@/components/ui/HugeIcon";
import { toast } from "sonner";
import { sendAppNotification } from "@/lib/notifications";

interface FeedbackModalProps {
  isOpen: boolean;
  bookingId: string;
  studentId: string;
  studentName: string;
  tier: string;
  scheduledDate?: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function FeedbackModal({
  isOpen,
  bookingId,
  studentId,
  studentName,
  tier,
  scheduledDate,
  onClose,
  onSubmitted,
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || rating === 0) return;

    setSubmitting(true);
    try {
      // 1. Save review to Firestore 'reviews' collection
      await addDoc(collection(db, "reviews"), {
        bookingId,
        studentId,
        studentName: studentName || "Student",
        tier,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      });

      // 2. Mark booking as having feedback submitted
      await updateDoc(doc(db, "bookings", bookingId), {
        hasFeedback: true,
        rating,
      });

      // 3. Notify tutor of feedback
      await sendAppNotification({
        userId: "tutor_cubicle",
        title: `⭐ ${rating}-Star Review from ${studentName || "Student"}`,
        message: comment ? `"${comment.slice(0, 100)}..."` : `${studentName} left a ${rating}-star rating for their ${tier} session.`,
        type: "system",
        link: "/dashboard",
      });

      toast.success("Thank you! Your feedback helps us improve every lesson.");
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Failed to save feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-border-light shadow-2xl p-6 sm:p-8 transform animate-[aeBubblePop_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] font-body space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border-light pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center">
              <HugeIcon name="star" size={20} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                How was your lesson?
              </h3>
              <p className="text-xs text-text-secondary">
                {tier.charAt(0).toUpperCase() + tier.slice(1)} Session • {scheduledDate || "Recently completed"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
          >
            <HugeIcon name="cancel" size={16} />
          </button>
        </div>

        {/* Rating Stars */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2">
            <label className="block text-xs font-semibold text-text-secondary mb-2">
              Rate your learning experience
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                >
                  <HugeIcon
                    name="star"
                    size={32}
                    className={`${
                      (hoverRating || rating) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-border-light"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-heading font-bold text-accent-blue mt-2">
              {rating === 5 && "⭐ Outstanding! Loved it!"}
              {rating === 4 && "Great lesson, very helpful!"}
              {rating === 3 && "Good session, had fun."}
              {rating === 2 && "Needs improvement."}
              {rating === 1 && "Not satisfied."}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              What did you like most? (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. The conversation practice was great, and the tutor explained Spanish verb tenses clearly!"
              className="w-full p-3.5 rounded-2xl border border-border-light bg-surface-near-white text-xs font-body text-text-primary placeholder:text-text-subtle focus:border-accent-blue transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-light">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-full border border-border-light text-xs font-semibold text-text-secondary hover:bg-surface-muted transition-colors disabled:opacity-50"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue-hover transition-colors shadow-xs disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
