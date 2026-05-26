"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRegion } from "@/context/RegionContext";
import { getCoursePriceLabel, type Course } from "@/features/prime-landing/components/chapters/courseData";

export function CoursePriceBadge({ course }: { course: Course }) {
  const { region } = useRegion();
  const label = getCoursePriceLabel(course, region);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={region}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="rounded-full bg-[var(--gold)]/15 px-3 py-1 text-[var(--gold-bright)]"
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}
