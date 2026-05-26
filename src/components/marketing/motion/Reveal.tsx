"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  defaultTransition,
  fadeUp,
  viewportOnce,
} from "@/lib/marketing-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "section" | "header" | "li" | "article";
};

export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref as RefObject<HTMLDivElement>}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </Component>
  );
}
