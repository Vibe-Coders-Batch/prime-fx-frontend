"use client";

import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";

export function BackgroundCanvas() {
  const theme = useScrollStore((s) => s.theme);
  const isPaper = theme === "paper";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 transition-colors duration-700"
      style={{
        backgroundColor: isPaper ? "var(--paper)" : "var(--ink)",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}

