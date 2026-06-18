"use client";

import { useRef, useState } from "react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { StaffingRegionPanel, type StaffingRegion } from "@/features/staffing/components/StaffingRegionPanel";
import { StaffingRegionToggle } from "@/features/staffing/components/StaffingRegionToggle";
import { useStaffingReveal } from "@/features/staffing/hooks/useStaffingReveal";

export function StaffingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [region, setRegion] = useState<StaffingRegion>("india");
  useStaffingReveal(rootRef);

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36 lg:pt-44">
        <div
          ref={rootRef}
          className={`pointer-events-none absolute inset-x-0 top-0 h-[560px] ${
            region === "india"
              ? "bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.14),transparent_62%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(224,180,88,0.12),transparent_60%)]"
          }`}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div data-reveal className="mb-10">
            <StaffingRegionToggle value={region} onChange={setRegion} />
          </div>

          <div key={region}>
            <StaffingRegionPanel region={region} showSiblingLink={false} />
          </div>
        </div>
      </main>
    </MarketingPageShell>
  );
}
