"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/marketing/motion/Reveal";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { scaleIn } from "@/lib/marketing-motion";

type Cta = { label: string; href: string; variant: "ghost" | "gold" | "primary" };

export function AnimatedCtaRow({ ctas }: { ctas: Cta[] }) {
  return (
    <Reveal className="mt-20 flex flex-wrap gap-4" variants={scaleIn}>
      {ctas.map((cta, i) => (
        <motion.div
          key={cta.href}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <Button as="a" href={cta.href} variant={cta.variant}>
            {cta.label}
          </Button>
        </motion.div>
      ))}
    </Reveal>
  );
}
