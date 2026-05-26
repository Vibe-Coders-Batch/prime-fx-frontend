"use client";

import { useRegion, type Region } from "@/context/RegionContext";

export function RegionToggle({ size = "sm" }: { size?: "sm" | "md" }) {
  const { region, setRegion } = useRegion();

  return (
    <div
      role="group"
      aria-label="Select your region"
      className="inline-flex overflow-hidden rounded-full border border-[var(--fog)]"
      style={{ fontSize: size === "sm" ? "13px" : "14px" }}
    >
      {(["IN", "AE"] as const).map((r: Region) => (
        <button
          key={r}
          type="button"
          onClick={() => setRegion(r)}
          aria-pressed={region === r}
          className="cursor-pointer border-none transition-[background,color] duration-150"
          style={{
            padding: size === "sm" ? "5px 14px" : "7px 18px",
            background: region === r ? "var(--gold)" : "transparent",
            color:
              region === r ? "var(--ink)" : "var(--text-secondary)",
            fontWeight: region === r ? 500 : 400,
            whiteSpace: "nowrap",
          }}
        >
          {r === "IN" ? "🇮🇳 India" : "🇦🇪 UAE"}
        </button>
      ))}
    </div>
  );
}
