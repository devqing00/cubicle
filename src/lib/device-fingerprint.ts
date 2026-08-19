"use client";

export function getOrCreateDeviceFingerprint(): string {
  if (typeof window === "undefined") return "";
  try {
    let fp = localStorage.getItem("cubicle_device_fingerprint");
    if (!fp) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      fp = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem("cubicle_device_fingerprint", fp);
    }
    return fp;
  } catch (e) {
    return "";
  }
}
