"use client";

import React from "react";
import { useJellyButtons } from "@/hooks/useJellyButtons";

export default function TactileProvider({ children }: { children: React.ReactNode }) {
  useJellyButtons();
  return <>{children}</>;
}

