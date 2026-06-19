"use client";

import type { StaffingRegion } from "@/features/staffing/components/StaffingRegionPanel";

type StaffingRegionToggleProps = {
  value: StaffingRegion;
  onChange: (region: StaffingRegion) => void;
};

const OPTIONS: { value: StaffingRegion; label: string }[] = [
  { value: "india", label: "India" },
  { value: "uae", label: "UAE" },
];

export function StaffingRegionToggle({ value, onChange }: StaffingRegionToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-[var(--fog)]/60 bg-white/[0.04] p-1"
      role="tablist"
      aria-label="Staff augmentation region"
    >
      {OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={
              "relative rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 " +
              (active
                ? "bg-[var(--gold)] text-[var(--ink)] shadow-[0_0_24px_-4px_rgba(212,175,55,0.5)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
