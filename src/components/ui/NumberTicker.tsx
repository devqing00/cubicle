"use client";

import React, { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  duration?: number; // duration in seconds
  delay?: number; // delay in seconds
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function NumberTicker({
  value,
  duration = 2,
  delay = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  className = "",
}: NumberTickerProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = spanRef.current;
    if (!element) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(num);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      if (elapsed < delay) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min((elapsed - delay) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = easedProgress * value;

      if (element) {
        element.textContent = `${prefix}${formatNumber(currentValue)}${suffix}`;
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (element) {
          element.textContent = `${prefix}${formatNumber(value)}${suffix}`;
        }
      }
    };

    // IntersectionObserver so animation triggers on scroll into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animationFrameId = requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, delay, decimalPlaces, prefix, suffix, hasAnimated]);

  return (
    <span
      ref={spanRef}
      className={`inline-block tabular-nums tracking-tight font-variant-numeric:tabular-nums ${className}`}
    >
      {prefix}0{suffix}
    </span>
  );
}
