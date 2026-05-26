"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import {
  defaultTransition,
  fadeUp,
  staggerContainer,
  staggerContainerFast,
} from "@/lib/marketing-motion";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <motion.header
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-3xl"
    >
      <motion.div variants={fadeUp} transition={defaultTransition}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </motion.div>
      <motion.h1
        variants={fadeUp}
        transition={{ ...defaultTransition, delay: 0.06 }}
        className="display mt-6 max-w-[16ch]"
        style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          lineHeight: 1.1,
          color: "var(--gold-bright)",
        }}
      >
        {title}
      </motion.h1>
      <motion.p
        variants={fadeUp}
        transition={{ ...defaultTransition, delay: 0.12 }}
        className="body-lg mt-6 max-w-2xl"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </motion.p>
      {children && (
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
    </motion.header>
  );
}
