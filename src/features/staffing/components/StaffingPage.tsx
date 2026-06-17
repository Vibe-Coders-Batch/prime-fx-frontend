"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { STAFFING_EMAIL, STAFFING_HUBS } from "@/config/staffing-regions";
import { useStaffingReveal } from "@/features/staffing/hooks/useStaffingReveal";

export function StaffingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useStaffingReveal(rootRef);

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36 lg:pt-44">
        <div ref={rootRef} className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="Prime Learning · Staffing"
            title={
              <>
                Group workforce capabilities across{" "}
                <em className="italic text-[var(--gold)]">India</em> and the{" "}
                <em className="italic text-[var(--gold)]">Middle East</em>.
              </>
            }
            description="Corporate overview of Prime Learning staffing — regional hubs optimised for high-velocity tech scaling in India and GCC enterprise mobilisation, compliance, and executive search."
          >
            <Button as="a" href={`mailto:${STAFFING_EMAIL}`} variant="primary">
              Talk to staffing team
            </Button>
          </PageHeader>

          <section className="mt-16 grid gap-6 lg:grid-cols-2">
            {STAFFING_HUBS.map((hub) => (
              <Link
                key={hub.slug}
                href={hub.href}
                data-reveal
                className={`group relative overflow-hidden rounded-2xl border p-8 transition hover:-translate-y-0.5 ${
                  hub.accent === "electric"
                    ? "border-[var(--electric)]/25 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_55%)] hover:border-[var(--electric)]/45"
                    : "border-[var(--gold)]/25 bg-[radial-gradient(circle_at_top_right,rgba(224,180,88,0.1),transparent_55%)] hover:border-[var(--gold)]/45"
                }`}
              >
                <Eyebrow>{hub.title}</Eyebrow>
                <h2 className="display mt-5 text-2xl text-[var(--text-primary)] md:text-3xl">{hub.headline}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{hub.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold-bright)]">
                  Explore {hub.title}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </section>

          <section
            data-reveal
            className="mt-16 rounded-2xl border border-[var(--fog)]/60 bg-white/[0.02] p-8 md:p-10"
          >
            <Eyebrow>How we work</Eyebrow>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
              Each regional hub has a dedicated page with specialised positioning, compliance frameworks, and
              call-to-action flows. Choose your market to see capabilities, statutory trust factors, and contact
              options tailored to that region.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="/india-staffing" variant="primary">
                India staffing hub
              </Button>
              <Button as="a" href="/middle-east-staffing" variant="ghost">
                Middle East staffing hub
              </Button>
            </div>
          </section>
        </div>
      </main>
    </MarketingPageShell>
  );
}
