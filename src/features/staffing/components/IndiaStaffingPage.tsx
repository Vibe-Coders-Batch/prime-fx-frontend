"use client";

import { useRef } from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, ArrowUpRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { INDIA_STAFFING } from "@/config/staffing-regions";
import { useStaffingReveal } from "@/features/staffing/hooks/useStaffingReveal";
import { StaffingQuickContact } from "@/features/staffing/components/StaffingQuickContact";

const HUBS = ["Hyderabad", "Bangalore", "Noida", "Pune", "Chennai"] as const;

export function IndiaStaffingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useStaffingReveal(rootRef);
  const config = INDIA_STAFFING;

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36 lg:pt-44">
        <div
          ref={rootRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.14),transparent_62%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12">
            <header data-reveal className="max-w-2xl">
              <Eyebrow>{config.eyebrow}</Eyebrow>
              <h1
                className="display mt-6"
                style={{
                  fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                  lineHeight: 1.08,
                  color: "var(--gold-bright)",
                }}
              >
                <span className="block">{config.headline}</span>
                <span className="mt-4 block font-sans text-base font-normal tracking-normal text-[var(--text-secondary)]">
                  {config.seoKeyword} for enterprises, startups, and GCC captive centres.
                </span>
              </h1>
              <p className="body-lg mt-6 max-w-xl">{config.subheadline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button as="a" href={config.primaryCta.href} variant="primary">
                  {config.primaryCta.label}
                </Button>
                <Button as="a" href={config.secondaryCta.href} variant="ghost">
                  {config.secondaryCta.label}
                </Button>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                Tech hubs · {HUBS.join(" · ")}
              </p>
            </header>

            <div data-reveal className="lg:pt-4">
              <StaffingQuickContact regionLabel="India Staffing" />
            </div>
          </section>

          <section className="mt-20" data-reveal>
            <div className="max-w-3xl">
              <Eyebrow>Our Core Specializations</Eyebrow>
              <h2
                className="display mt-6"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--text-primary)" }}
              >
                Built for high-velocity tech scaling.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {config.specializations.map((item, index) => (
                <article
                  key={item.title}
                  data-reveal
                  className="group relative overflow-hidden rounded-2xl border border-[var(--electric)]/20 bg-white/[0.02] p-6 transition hover:border-[var(--electric)]/45"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--electric)]/60 to-transparent opacity-0 transition group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--electric)]/15 text-[var(--electric)]">
                      <Cpu className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--electric)]">
                        0{index + 1}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-[var(--text-primary)]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.blurb}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            data-reveal
            className="mt-20 overflow-hidden rounded-2xl border border-[var(--fog)]/60 bg-gradient-to-br from-[var(--mist)] to-[var(--ink)] p-8 md:p-10"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-[var(--gold-bright)]" aria-hidden="true" />
                  <Eyebrow>{config.complianceTitle}</Eyebrow>
                </div>
                <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)]">{config.complianceCopy}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:max-w-xs md:justify-end">
                {["EPF / ESI", "Contract Labour Act", "Shop & Establishment", "Full compliance shield"].map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1 text-xs font-medium text-[var(--gold-bright)]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section data-reveal className="mt-16 rounded-2xl border border-[var(--fog)]/60 bg-white/[0.02] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              Also explore
            </p>
            <Link
              href={config.sibling.href}
              className="group mt-3 flex items-start justify-between gap-4 rounded-xl border border-transparent p-2 transition hover:border-[var(--fog)]/60"
            >
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)]">{config.sibling.label}</p>
                <p className="mt-2 max-w-xl text-sm text-[var(--text-secondary)]">{config.sibling.blurb}</p>
              </div>
              <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--gold-bright)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </section>
        </div>
      </main>
    </MarketingPageShell>
  );
}
