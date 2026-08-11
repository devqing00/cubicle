"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "blue" | "black" | "white";
  size?: number; // Logo icon height/width in px
  showText?: boolean;
  href?: string;
  className?: string;
}

export default function Logo({
  variant = "blue",
  size = 24,
  showText = true,
  href = "/",
  className = "",
}: LogoProps) {
  // CSS filter to transform the original blue logo into pure black or pure white if requested
  const filterStyle =
    variant === "black"
      ? { filter: "brightness(0)" }
      : variant === "white"
      ? { filter: "brightness(0) invert(1)" }
      : {};

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src="/images/cubicle_logo.png"
          alt="Cubicle Logo"
          width={size}
          height={size}
          style={filterStyle}
          className="object-contain transition-transform group-hover:scale-101"
          priority
        />
      </div>
      {showText && (
        <span
          className={`font-heading font-bold text-lg tracking-tight transition-colors ${
            variant === "white"
              ? "text-white"
              : variant === "black"
              ? "text-text-primary"
              : "text-text-primary group-hover:text-accent-blue"
          }`}
        >
          Cubicle
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link className="flex justify-center items-center w-fit h-9" href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
