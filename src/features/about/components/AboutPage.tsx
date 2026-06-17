"use client";

import { Sparkles, TrendingUp, Compass } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { Reveal } from "@/components/marketing/motion/Reveal";
import { AnimatedCtaRow } from "@/components/marketing/motion/AnimatedCtaRow";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { SectionHeading, cardClass } from "@/features/contact/components/ContactDetails";
import { COMPANY, REGIONS } from "@/config/company";

const PILLARS = [
  {
    icon: Sparkles,
    title: "Learn Smarter",
    body: "Premium, practical programmes built by operators, not theorists. Every course ships toward a real outcome.",
  },
  {
    icon: TrendingUp,
    title: "Grow Faster",
    body: "Cohorts, mentorship, and hands on projects that move careers and teams forward quickly.",
  },
  {
    icon: Compass,
    title: "Lead With Purpose",
    body: "The skills and judgement to lead in an AI driven economy, across India, the UAE, and beyond.",
  },
];

export function AboutPage() {
  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-20 md:pt-36 lg:pt-44">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="About"
            title={
              <>
                Premium learning,{" "}
                <em className="italic text-[var(--gold)]">real outcomes</em>
              </>
            }
            description={`${COMPANY.brandName} is the education brand of ${COMPANY.legalName}, building career defining programmes for professionals across India, the UAE, and a global community.`}
          />

          {/* Story */}
          <Reveal as="section" className="mt-16">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
              <div className="space-y-5">
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  We started Prime Learning with a simple belief: serious learners
                  deserve programmes that are practical, mentor led, and built to
                  ship real results. No filler, no recycled theory.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Today our cohorts span agentic AI, applied engineering, and
                  leadership, delivered to individuals and organisations across
                  India and the UAE. Every programme is designed by operators who
                  have done the work, so what you learn maps directly to outcomes
                  in the real world.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {COMPANY.tagline}
                </p>
              </div>

              <div className={cardClass}>
                <Eyebrow>At a glance</Eyebrow>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt style={{ color: "var(--text-secondary)" }}>Legal entity</dt>
                    <dd className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                      {COMPANY.legalName}
                    </dd>
                  </div>
                  <div>
                    <dt style={{ color: "var(--text-secondary)" }}>Headquarters</dt>
                    <dd className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                      Hyderabad, Telangana, India
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt style={{ color: "var(--text-secondary)" }}>CIN</dt>
                      <dd className="mt-1 font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                        {COMPANY.cin}
                      </dd>
                    </div>
                    <div>
                      <dt style={{ color: "var(--text-secondary)" }}>PAN</dt>
                      <dd className="mt-1 font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                        {COMPANY.pan}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>

          {/* Pillars */}
          <Reveal as="section" className="mt-20">
            <SectionHeading eyebrow="What we stand for" title="Three promises" />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className={cardClass}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold-bright)]">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <h3
                    className="mt-5 text-base font-semibold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Where we operate */}
          <Reveal as="section" className="mt-20">
            <SectionHeading eyebrow="Where we work" title="Built in India and the UAE" />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {REGIONS.map((region) => (
                <div key={region.name} className={cardClass}>
                  <span className="text-3xl" aria-hidden="true">
                    {region.flag}
                  </span>
                  <h3
                    className="mt-4 text-base font-semibold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {region.name}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {region.note}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <AnimatedCtaRow
            ctas={[
              { label: "Contact us", href: "/contact", variant: "gold" },
              { label: "Start learning", href: "/signup", variant: "ghost" },
              { label: "Explore courses", href: "/#chapter-courses", variant: "ghost" },
            ]}
          />
        </div>
      </main>
    </MarketingPageShell>
  );
}
