"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, defaultTransition, springTransition } from "@/lib/marketing-motion";

type PersonCardProps = {
  name: string;
  subtitle: string;
  portrait: string;
  meta?: string;
  alt?: string;
  priority?: boolean;
};

export function PersonCard({
  name,
  subtitle,
  portrait,
  meta,
  alt,
  priority = false,
}: PersonCardProps) {
  return (
    <motion.figure variants={fadeUp} transition={defaultTransition} className="group cursor-default">
      <motion.div whileHover={{ y: -8 }} transition={springTransition}>
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-xl"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "var(--mist)",
          }}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={portrait}
              alt={alt ?? name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              priority={priority}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-black/50"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/3 opacity-0"
            style={{
              background:
                "linear-gradient(to top, rgba(224,180,88,0.25), transparent)",
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </motion.div>
      <motion.figcaption
        className="mt-4"
        initial={{ opacity: 0.85 }}
        whileHover={{ opacity: 1, x: 2 }}
        transition={{ duration: 0.25 }}
      >
        <div className="font-medium" style={{ color: "var(--text-primary)" }}>
          {name}
        </div>
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {subtitle}
        </div>
        {meta && (
          <div className="mt-1 text-xs" style={{ color: "var(--gold-bright)" }}>
            {meta}
          </div>
        )}
      </motion.figcaption>
    </motion.figure>
  );
}
