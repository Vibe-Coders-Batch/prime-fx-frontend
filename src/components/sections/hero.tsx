"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const revealedContentOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.6],
    [0, 1]
  );
  const revealedContentScale = useTransform(
    scrollYProgress,
    [0.5, 0.6],
    [0, 1]
  );
  const revealedContentY = useTransform(
    scrollYProgress,
    [0.5, 0.7],
    ["100%", "0%"]
  );

  const headlineWords = "Master the Global Markets".split(" ");

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] bg-background"
      aria-label="Hero section - Master the Global Markets"
    >
      <div className="sticky top-0 h-screen h-[100dvh] overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale"
            role="img"
            aria-label="Financial markets background"
          />
          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            <motion.div
              style={{
                scale: revealedContentScale,
                opacity: revealedContentOpacity,
              }}
              className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-bold tracking-widest text-primary-gold uppercase"
            >
              Live Classes & Tests
            </motion.div>

            <div className="overflow-hidden">
              <motion.p
                style={{ y: revealedContentY, opacity: revealedContentOpacity }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 text-center"
                role="heading"
                aria-level={2}
              >
                Trade with Precision
              </motion.p>
            </div>

            <motion.p
              style={{ opacity: revealedContentOpacity }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl text-center mb-6 sm:mb-8 px-2"
            >
              Join the elite community of traders mastering the markets with
              institutional-grade strategies and real-time mentorship.
            </motion.p>

            <motion.div style={{ opacity: revealedContentOpacity }}>
              <Link href="/login" aria-label="Start your trading journey - Login to get started">
                <Button className="bg-primary-gold text-primary-dark hover:bg-foreground hover:text-background text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 font-semibold">
                  Start Your Journey
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            style={{ scale }}
            className="w-10 h-10 bg-transparent rounded-full shadow-[0_0_0_500vmax_var(--color-background)]"
          />
        </div>

        <motion.header
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto px-4 pt-16 sm:pt-20"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground tracking-tighter text-center flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.1,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                {word === "Global" || word === "Markets" ? (
                  <span className="text-primary-gold">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl text-center leading-relaxed"
          >
            For Students, Professionals, and Aspirants. The ultimate ecosystem
            for financial literacy.
          </motion.p>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
            aria-label="Hero actions"
          >
            <Link href="/login" aria-label="Start your learning journey" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary-gold text-primary-dark hover:bg-white text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 font-bold">
                Start Journey
              </Button>
            </Link>
            <Link href="#curriculum" aria-label="View our curriculum and course offerings" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-foreground/20 text-foreground hover:bg-foreground hover:text-background text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6"
              >
                View Curriculum
              </Button>
            </Link>
          </motion.nav>
        </motion.header>
      </div>
    </section>
  );
}
