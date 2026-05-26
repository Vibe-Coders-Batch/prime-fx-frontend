"use client";

import { motion } from "framer-motion";

export function MarketingAmbient() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -left-[20%] top-[10%] h-[min(520px,60vw)] w-[min(520px,60vw)] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(224,180,88,0.14) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, 24, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[15%] top-[35%] h-[min(480px,55vw)] w-[min(480px,55vw)] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -32, 0],
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[5%] left-[30%] h-[min(360px,40vw)] w-[min(360px,40vw)] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)",
        }}
        animate={{
          x: [0, 20, 0],
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
