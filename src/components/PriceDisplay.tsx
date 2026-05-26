"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePrice } from "@/hooks/usePrice";
import { useRegion } from "@/context/RegionContext";
import type { PriceKey } from "@/config/pricing";

export function PriceDisplay({
  priceKey,
  className,
}: {
  priceKey: PriceKey;
  className?: string;
}) {
  const price = usePrice(priceKey);
  const { region } = useRegion();

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={region}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className={className}
      >
        {price}
      </motion.span>
    </AnimatePresence>
  );
}
