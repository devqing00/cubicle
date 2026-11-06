"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useJellyButtons() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSoundTime = useRef(0);

  // Initialize Web Audio API on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            audioCtxRef.current = new AudioContextClass();
          }
        } catch (_) {}
      }
    };

    window.addEventListener("pointerdown", initAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", initAudio);
    };
  }, []);

  const playJellyPop = () => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Prevent rapid overlapping sound distortion (max 1 sound per 50ms)
      if (now - lastSoundTime.current < 0.05) return;
      lastSoundTime.current = now;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Subtle, satisfying tactile pop: starts at ~520Hz and drops quickly to ~220Hz
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

      // Soft tactile gain envelope
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (_) {}
  };

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "button, [role='button'], .tactile-btn, a.tactile-btn, .btn-tactile-primary, a.btn-tactile-primary, .btn-tactile-secondary, a.btn-tactile-secondary, .btn-tactile-dark, a.btn-tactile-dark, .doron-btn-glow, a.doron-btn-glow, .doron-btn-white, a.doron-btn-white, .tactile-card-interactive, [data-tactile='true'], a[class*='btn']"
      );

      // Strictly target buttons; ignore plain links, dropdown containers, etc.
      if (!target) return;

      const el = target as HTMLElement;

      // Don't trigger if explicitly disabled or marked no-jelly
      if (
        el.hasAttribute("disabled") ||
        el.getAttribute("aria-disabled") === "true" ||
        el.classList.contains("no-jelly")
      ) {
        return;
      }

      // Play the tactile jelly micro-pop sound
      playJellyPop();

      // Kill previous tweens on this element for rapid clicking responsiveness
      gsap.killTweensOf(el);
      gsap.set(el, { transformOrigin: "center center" });

      // Subtle, organic jelly physics (squish -> overshoot -> counter -> settle)
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      tl.to(el, {
        scaleX: 1.07,
        scaleY: 0.93,
        duration: 0.08,
        ease: "power2.out",
      })
        .to(el, {
          scaleX: 0.96,
          scaleY: 1.05,
          duration: 0.13,
          ease: "power1.out",
        })
        .to(el, {
          scaleX: 1.015,
          scaleY: 0.99,
          duration: 0.11,
          ease: "power1.inOut",
        })
        .to(el, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.15,
          ease: "elastic.out(1, 0.4)",
        });
    };

    // Use pointerdown so the tactile squish and sound trigger on instant touch/press
    document.addEventListener("pointerdown", handlePointerDown as EventListener, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown as EventListener);
    };
  }, []);
}

export default useJellyButtons;

