"use client";

import { motion } from "framer-motion";
import { useRegion } from "@/context/RegionContext";
import { FLAGSHIP_EVENTS, UPCOMING_SESSIONS } from "@/data/events";
import { REGION_CONTENT } from "@/config/pricing";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { Reveal } from "@/components/marketing/motion/Reveal";
import { EventCard } from "@/components/marketing/motion/EventCard";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";
import {
  defaultTransition,
  fadeUp,
  scaleIn,
  slideFromLeft,
  staggerContainer,
  viewportOnce,
} from "@/lib/marketing-motion";

const REGION_LABEL = { IN: "🇮🇳 India", AE: "🇦🇪 UAE", GLOBAL: "🌍 Global" } as const;

export function EventsPage() {
  const { region } = useRegion();
  const regional = REGION_CONTENT[region];

  const sortedSessions = [...UPCOMING_SESSIONS].sort((a, b) => {
    if (a.region === region) return -1;
    if (b.region === region) return 1;
    return 0;
  });

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="Events"
            title={
              <>
                Live{" "}
                <em className="italic text-[var(--gold)]">cohorts</em>
              </>
            }
            description="Closed-door executive briefings and production AI programmes — hosted across India, the UAE, and online."
          />

          <Reveal as="section" className="mt-16" aria-label="Upcoming sessions">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={defaultTransition}
            >
              <Eyebrow>On the calendar</Eyebrow>
            </motion.div>
            <motion.ul
              className="mt-6 grid gap-4 sm:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {sortedSessions.map((session) => (
                <motion.li
                  key={session.title}
                  variants={fadeUp}
                  transition={defaultTransition}
                  whileHover={{
                    y: -6,
                    borderColor: "rgba(224,180,88,0.35)",
                  }}
                  className="rounded-2xl border border-[var(--fog)]/80 bg-[var(--mist)]/40 p-5 transition-colors"
                >
                  <div>
                    <motion.span
                      className="inline-block text-[10px] uppercase tracking-[0.2em] text-[var(--gold-bright)]"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {REGION_LABEL[session.region]}
                    </motion.span>
                    <h2 className="headline mt-3 text-lg" style={{ color: "var(--text-primary)" }}>
                      {session.title}
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      {session.location}
                    </p>
                    <p
                      className="mt-1 text-xs uppercase tracking-[0.18em]"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {session.date}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </Reveal>

          <Reveal as="section" className="mt-20" aria-label="Programmes" delay={0.05}>
            <Eyebrow>Programme tracks</Eyebrow>
            <motion.div
              className="mt-8 grid gap-6 lg:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {FLAGSHIP_EVENTS.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          </Reveal>

          <Reveal
            className="mt-20 overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--mist)] to-[var(--ink)] p-8 sm:flex-row sm:items-center sm:justify-between"
            variants={scaleIn}
          >
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={slideFromLeft} transition={defaultTransition}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {regional.contactLine}
                </p>
                <p className="mt-2 text-lg" style={{ color: "var(--text-primary)" }}>
                  {regional.applyCta}
                </p>
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-3"
                variants={slideFromLeft}
                transition={{ ...defaultTransition, delay: 0.1 }}
              >
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button as="a" href="/#chapter-cohort" variant="primary">
                    View on homepage
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button as="a" href="/signup" variant="ghost">
                    Enroll
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </main>
    </MarketingPageShell>
  );
}
