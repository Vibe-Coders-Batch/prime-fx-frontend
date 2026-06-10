"use client";

import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { Reveal } from "@/components/marketing/motion/Reveal";
import { AnimatedCtaRow } from "@/components/marketing/motion/AnimatedCtaRow";
import {
  ContactDetails,
  SectionHeading,
  cardClass,
} from "@/features/contact/components/ContactDetails";
import { REGIONS } from "@/config/company";

export function ContactPage() {
  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-20 md:pt-36 lg:pt-44">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="Contact"
            title={
              <>
                Talk to{" "}
                <em className="italic text-[var(--gold)]">Prime Learning</em>
              </>
            }
            description="Whether you are enrolling, hiring talent, or partnering with us, reach the right team directly. Every channel, office, and line is listed below."
          />

          <ContactDetails />

          {/* Where we operate */}
          <Reveal as="section" className="mt-16">
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
              { label: "Start learning", href: "/signup", variant: "gold" },
              { label: "Explore courses", href: "/#chapter-courses", variant: "ghost" },
            ]}
          />
        </div>
      </main>
    </MarketingPageShell>
  );
}
