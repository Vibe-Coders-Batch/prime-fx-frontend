"use client";

import { useRef } from "react";
import Link from "next/link";
import { Building2, Globe2, CheckCircle2, ArrowUpRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { MIDDLE_EAST_STAFFING } from "@/config/staffing-regions";
import { useStaffingReveal } from "@/features/staffing/hooks/useStaffingReveal";
import { StaffingQuickContact } from "@/features/staffing/components/StaffingQuickContact";

const GCC = ["UAE", "KSA", "Qatar", "Kuwait", "Bahrain", "Oman"] as const;

export function MiddleEastStaffingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useStaffingReveal(rootRef);
  const config = MIDDLE_EAST_STAFFING;
  const gridItems = config.specializations.slice(0, 3);
  const featured = config.specializations[3];

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36 lg:pt-44">
        <div
          ref={rootRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_top,rgba(224,180,88,0.12),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <section className="border-b border-[var(--fog)]/50 pb-14">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
              <header data-reveal>
                <Eyebrow>{config.eyebrow}</Eyebrow>
                <h1
                  className="display mt-6 max-w-3xl"
                  style={{
                    fontSize: "clamp(2.25rem, 4.5vw, 3.65rem)",
                    lineHeight: 1.1,
                    color: "var(--gold-bright)",
                  }}
                >
                  <span className="block">{config.headline}</span>
                  <span className="mt-4 block font-sans text-base font-normal tracking-normal text-[var(--text-secondary)]">
                    {config.seoKeyword} for GCC enterprise, infrastructure, and nationalization mandates.
                  </span>
                </h1>
                <p className="body-lg mt-6 max-w-2xl">{config.subheadline}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button as="a" href={config.primaryCta.href} variant="primary">
                    {config.primaryCta.label}
                  </Button>
                  <Button as="a" href={config.secondaryCta.href} variant="ghost">
                    {config.secondaryCta.label}
                  </Button>
                </div>
              </header>

              <div data-reveal>
                <StaffingQuickContact regionLabel="Middle East Staffing" />
              </div>
            </div>
          </section>

          <section className="mt-16" data-reveal>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              GCC coverage · {GCC.join(" · ")}
            </p>
          </section>

          <section className="mt-12">
            <div className="max-w-3xl" data-reveal>
              <Eyebrow>Our Core Specializations</Eyebrow>
              <h2
                className="display mt-6"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--text-primary)" }}
              >
                Enterprise transformation at GCC scale.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {gridItems.map((item) => (
                <article
                  key={item.title}
                  data-reveal
                  className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--mist)]/30 p-6"
                >
                  <Building2 className="h-5 w-5 text-[var(--gold-bright)]" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.blurb}</p>
                </article>
              ))}
            </div>

            {featured && (
              <article
                data-reveal
                className="mt-5 overflow-hidden rounded-2xl border border-[var(--gold)]/35 bg-gradient-to-r from-[var(--mist)] to-[var(--ink)] p-8 md:flex md:items-center md:justify-between md:gap-8"
              >
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 text-[var(--gold-bright)]">
                    <Globe2 className="h-5 w-5" aria-hidden="true" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">Leadership</p>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">{featured.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{featured.blurb}</p>
                </div>
              </article>
            )}
          </section>

          <section
            data-reveal
            className="mt-20 rounded-2xl border border-[var(--fog)]/60 bg-white/[0.02] p-8 md:p-10"
          >
            <Eyebrow>{config.complianceTitle}</Eyebrow>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
              {config.complianceCopy}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["Qiwa aligned", "GOSI ready", "MOHRE guidelines", "Cultural onboarding"].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-[var(--fog)]/50 bg-[var(--mist)]/20 px-4 py-3 text-sm text-[var(--text-primary)]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--gold-bright)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
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
