"use client";

import { useEffect } from "react";
import { gsap } from "@/features/prime-landing/lib/gsap";

export function DebugFlags() {
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    if (params.get("slow") === "1") {
      document.documentElement.dataset.slow = "1";
      gsap.globalTimeline.timeScale(1 / 3);
    }
    if (params.get("grid") === "1") {
      document.documentElement.dataset.grid = "1";
    }
  }, []);

  return null;
}

