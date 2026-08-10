"use client";

import React, { useEffect } from "react";
import HugeIcon from "@/components/ui/HugeIcon";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
  iconName?: "alert" | "shield" | "logout" | "calendar" | "sparkles";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  iconName = "alert",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-red-50 text-red-600 border-red-200",
      btnBg: "bg-red-600 hover:bg-red-700 text-white shadow-xs shadow-red-600/20",
    },
    primary: {
      iconBg: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
      btnBg: "bg-text-primary hover:bg-black text-white shadow-xs",
    },
    warning: {
      iconBg: "bg-amber-50 text-amber-600 border-amber-200",
      btnBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-xs shadow-amber-600/20",
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => !loading && onCancel()}
      />

      {/* Modal Container with Spring Pop Motion */}
      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-border-light shadow-2xl p-6 sm:p-8 z-10 transform animate-[aeBubblePop_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] space-y-6">
        
        {/* Header with Icon */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}>
            <HugeIcon name={iconName} size={24} />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text-primary mb-1">{title}</h3>
            <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full font-body text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors border border-border-light disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-full font-body text-xs font-semibold transition-all disabled:opacity-50 ${currentVariant.btnBg}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
