"use client";

import Link from "next/link";
import { Cpu, ShieldCheck, Building2, Globe2, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { INDIA_STAFFING, MIDDLE_EAST_STAFFING } from "@/config/staffing-regions";
import { StaffingQuickContact } from "@/features/staffing/components/StaffingQuickContact";

export type StaffingRegion = "india" | "uae";

const INDIA_HUBS = ["Hyderabad", "Bangalore", "Noida", "Pune", "Chennai"] as const;
const GCC = ["UAE", "KSA", "Qatar", "Kuwait", "Bahrain", "Oman"] as const;

type StaffingRegionPanelProps = {
  region: StaffingRegion;
  showSiblingLink?: boolean;
};

export function StaffingRegionPanel({ region, showSiblingLink = true }: StaffingRegionPanelProps) {
  if (region === "india") {
    const config = INDIA_STAFFING;

    return (
      <>
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
            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              Tech hubs · {INDIA_HUBS.join(" · ")}
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

        {showSiblingLink && (
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
        )}
      </>
    );
  }

  const config = MIDDLE_EAST_STAFFING;
  const gridItems = config.specializations.slice(0, 3);
  const featured = config.specializations[3];

  return (
    <>
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
          </header>

          <div data-reveal>
            <StaffingQuickContact regionLabel="UAE Staffing" />
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

      {showSiblingLink && (
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
      )}
    </>
  );
}
