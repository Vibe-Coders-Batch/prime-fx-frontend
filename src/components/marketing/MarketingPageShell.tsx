"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import "@/features/prime-landing/PrimeLandingStyles.module.css";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingAmbient } from "@/components/marketing/motion/MarketingAmbient";
import { Footer } from "@/features/prime-landing/components/ui/Footer";
import { pageEnter } from "@/lib/marketing-motion";

export function MarketingPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="dark primeLanding relative min-h-screen overflow-x-hidden" style={{ backgroundColor: "var(--ink)" }}>
      <MarketingAmbient />
      <MarketingNav variant="static" />
      <motion.div
        className="relative z-[1]"
        variants={pageEnter}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
      <div className="relative z-[1]">
        <Footer />
      </div>
    </div>
  );
}
