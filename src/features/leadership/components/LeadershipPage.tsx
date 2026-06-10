"use client";

import { motion } from "framer-motion";
import { FEATURED_LEADER, LEADERSHIP_TEAM } from "@/data/leadership-team";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { SpotlightHero } from "@/components/marketing/motion/SpotlightHero";
import { LeadershipPersonCard } from "@/components/marketing/motion/LeadershipPersonCard";
import { AnimatedCtaRow } from "@/components/marketing/motion/AnimatedCtaRow";
import {
  staggerContainer,
  viewportOnce,
} from "@/lib/marketing-motion";

export function LeadershipPage() {
  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36 lg:pt-44">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="Leadership"
            title={
              <>
                Operators who{" "}
                <em className="italic text-[var(--gold)]">set the bar</em>
              </>
            }
            description="The mentors and executives behind Prime Learning — building premium programmes across India, the UAE, and a global learner community. Hover a profile to read their focus areas and experience."
          />

          <SpotlightHero
            quote={FEATURED_LEADER.quote}
            name={FEATURED_LEADER.name}
            subtitle={FEATURED_LEADER.role}
            portrait={FEATURED_LEADER.portrait}
            badge={FEATURED_LEADER.role}
          />

          <motion.div
            className="mt-20 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {LEADERSHIP_TEAM.map((member, i) => (
              <LeadershipPersonCard
                key={member.name}
                member={member}
                priority={i < 3}
              />
            ))}
          </motion.div>

          <AnimatedCtaRow
            ctas={[
              { label: "View on homepage", href: "/#chapter-core-team", variant: "ghost" },
              { label: "View events", href: "/events", variant: "gold" },
            ]}
          />
        </div>
      </main>
    </MarketingPageShell>
  );
}
