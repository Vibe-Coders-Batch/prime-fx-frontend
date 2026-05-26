"use client";

import { motion } from "framer-motion";
import { FEATURED_INSTRUCTOR, INSTRUCTORS } from "@/data/instructors";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { SpotlightHero } from "@/components/marketing/motion/SpotlightHero";
import { PersonCard } from "@/components/marketing/motion/PersonCard";
import { AnimatedCtaRow } from "@/components/marketing/motion/AnimatedCtaRow";
import { staggerContainer, viewportOnce } from "@/lib/marketing-motion";

export function SpotlightPage() {
  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="Spotlight"
            title={
              <>
                Instructors who{" "}
                <em className="italic text-[var(--gold)]">ship</em> with you
              </>
            }
            description="Practitioners from top product and engineering teams — teaching what they build in production, not theory from a slide deck."
          />

          <SpotlightHero
            quote={FEATURED_INSTRUCTOR.quote}
            name={FEATURED_INSTRUCTOR.name}
            subtitle={FEATURED_INSTRUCTOR.credential}
            portrait={FEATURED_INSTRUCTOR.portrait}
            badge={`${FEATURED_INSTRUCTOR.courses} courses`}
          />

          <motion.div
            className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {INSTRUCTORS.map((instructor, i) => (
              <PersonCard
                key={instructor.name}
                name={instructor.name}
                subtitle={instructor.credential}
                portrait={instructor.portrait}
                meta={`${instructor.courses} courses`}
                priority={i < 2}
              />
            ))}
          </motion.div>

          <AnimatedCtaRow
            ctas={[
              { label: "View on homepage", href: "/#chapter-instructors", variant: "ghost" },
              { label: "Explore courses", href: "/#chapter-courses", variant: "gold" },
            ]}
          />
        </div>
      </main>
    </MarketingPageShell>
  );
}
