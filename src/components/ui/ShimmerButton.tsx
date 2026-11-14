"use client";

import React from "react";
import Link from "next/link";

interface ShimmerButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  shimmerColor?: string;
  variant?: "primary" | "dark" | "outline";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function ShimmerButton({
  children,
  href,
  onClick,
  className = "",
  shimmerColor = "rgba(255, 255, 255, 0.4)",
  variant = "primary",
  type = "button",
  disabled = false,
}: ShimmerButtonProps) {
  const baseClasses =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-body font-semibold transition-all duration-300 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-accent-blue text-white shadow-md hover:bg-accent-blue/95 hover:shadow-lg hover:shadow-accent-blue/20",
    dark:
      "bg-text-primary text-white shadow-sm hover:bg-neutral-800 hover:shadow-md",
    outline:
      "bg-white text-text-primary border border-border-light hover:border-accent-blue/40 hover:bg-surface-muted",
  };

  const content = (
    <>
      {/* Moving Shimmer Beam */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
          opacity: 0.35,
        }}
        aria-hidden="true"
      />
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {content}
    </button>
  );
}
