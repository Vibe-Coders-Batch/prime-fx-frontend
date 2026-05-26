"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  defaultTransition,
  lineGrow,
  slideFromLeft,
  slideFromRight,
  staggerContainer,
} from "@/lib/marketing-motion";

type SpotlightHeroProps = {
  quote: string;
  name: string;
  subtitle: string;
  portrait: string;
  badge: string;
};

export function SpotlightHero({
  quote,
  name,
  subtitle,
  portrait,
  badge,
}: SpotlightHeroProps) {
  return (
    <motion.div
      className="mt-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div variants={slideFromLeft} transition={defaultTransition} className="lg:col-span-7">
        <motion.svg
          aria-hidden="true"
          className="h-8 w-8"
          viewBox="0 0 32 32"
          fill="none"
          initial={{ opacity: 0, rotate: -8 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <path
            d="M4 20c0-5.333 2.667-10 8-14l2 2C10.667 10.667 9.333 14 10 18h6v8H4v-6zm16 0c0-5.333 2.667-10 8-14l2 2C26.667 10.667 25.333 14 26 18h6v8H20v-6z"
            fill="var(--gold)"
            opacity="0.5"
          />
        </motion.svg>

        <motion.blockquote
          className="display mt-4 italic"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...defaultTransition, delay: 0.2 }}
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        <motion.figcaption
          className="mt-8 flex items-center gap-3 text-sm"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={lineGrow}
            transition={defaultTransition}
            className="h-px w-10 origin-left"
            style={{ backgroundColor: "rgba(245,242,235,0.3)" }}
          />
          <motion.span variants={slideFromLeft} style={{ color: "var(--text-primary)" }}>
            {name}
          </motion.span>
          <span style={{ color: "var(--text-tertiary)" }}>·</span>
          <motion.span variants={slideFromLeft} style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </motion.span>
        </motion.figcaption>
      </motion.div>

      <motion.div
        variants={slideFromRight}
        transition={{ ...defaultTransition, delay: 0.08 }}
        className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:col-span-5"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        whileHover={{ scale: 1.015 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={portrait}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/45" />
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, rgba(224,180,88,0.12) 100%)",
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...defaultTransition, delay: 0.35 }}
        >
          <span className="display text-base" style={{ color: "var(--text-primary)" }}>
            {name}
          </span>
          <motion.span
            className="rounded-full px-2.5 py-1"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              color: "var(--text-primary)",
            }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(224,180,88,0.2)" }}
          >
            {badge}
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
