"use client";

import { motion } from "framer-motion";
import type { FellowshipEvent } from "@/data/events";
import {
  defaultTransition,
  fadeUp,
  springTransition,
  staggerContainerFast,
} from "@/lib/marketing-motion";

const REGION_LABEL = { IN: "🇮🇳 India", AE: "🇦🇪 UAE", GLOBAL: "🌍 Global" } as const;

export function EventCard({ event }: { event: FellowshipEvent }) {
  return (
    <motion.article
      variants={fadeUp}
      transition={defaultTransition}
      whileHover={{ y: -6 }}
      className="flex flex-col rounded-2xl border border-[var(--fog)]/80 bg-[var(--mist)]/40 p-6 transition-shadow duration-300 hover:border-[var(--gold)]/40 hover:shadow-[0_20px_50px_-20px_rgba(224,180,88,0.2)] sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--gold-bright)]">
          {event.tag}
        </span>
        {event.regions.map((r) => (
          <span
            key={r}
            className="rounded-full border border-[var(--fog)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--text-tertiary)" }}
          >
            {REGION_LABEL[r]}
          </span>
        ))}
      </div>
      <h2
        className="display mt-4 text-2xl sm:text-[1.75rem]"
        style={{ color: "var(--text-primary)", lineHeight: 1.15 }}
      >
        {event.title}
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        {event.meta} · {event.format}
      </p>

      <motion.ul
        className="mt-6 flex-1 divide-y divide-[var(--fog)]/60 border-y border-[var(--fog)]/60"
        variants={staggerContainerFast}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {event.phases.map((phase) => (
          <motion.li
            key={phase.code}
            variants={fadeUp}
            className="flex gap-4 py-3 text-sm"
            style={{ color: "var(--text-secondary)" }}
            whileHover={{ x: 6 }}
            transition={springTransition}
          >
            <span
              className="display shrink-0 text-base"
              style={{ color: "var(--gold-bright)", minWidth: "2.25rem" }}
            >
              {phase.code}
            </span>
            <span>
              <strong style={{ color: "var(--text-primary)" }}>{phase.name}</strong>
              <span className="block text-xs opacity-80">{phase.deliverable}</span>
            </span>
          </motion.li>
        ))}
      </motion.ul>

      <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
        {event.footer}
      </p>
    </motion.article>
  );
}
