"use client";

import { useRef } from "react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { StaffingRegionPanel } from "@/features/staffing/components/StaffingRegionPanel";
import { useStaffingReveal } from "@/features/staffing/hooks/useStaffingReveal";

export function MiddleEastStaffingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useStaffingReveal(rootRef);

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36 lg:pt-44">
        <div
          ref={rootRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_top,rgba(224,180,88,0.12),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <StaffingRegionPanel region="uae" />
        </div>
      </main>
    </MarketingPageShell>
  );
}
