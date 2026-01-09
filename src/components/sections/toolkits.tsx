"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function ToolkitItem({
  title,
  headline,
  description,
  index,
  imageSrc,
  imageAlt,
}: {
  title: string;
  headline: string;
  description: string;
  index: number;
  imageSrc: string;
  imageAlt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const isEven = index % 2 === 0;

  return (
    <article
      ref={ref}
      className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 py-12 ${
        isEven ? "" : "md:flex-row-reverse"
      }`}
    >
      <div className="flex-1 space-y-6">
        <header>
          <p className="flex items-center gap-3 text-primary-gold mb-2">
            <span className="text-sm font-bold tracking-widest uppercase">
              {title}
            </span>
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">
            {headline}
          </h3>
        </header>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
        <Link
          href="/signup"
          aria-label={`Learn more about ${title}`}
        >
          <Button
            variant="outline"
            className="border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-primary-dark"
          >
            Learn More
          </Button>
        </Link>
      </div>
      <figure className="flex-1 relative aspect-video bg-card/50 rounded-xl overflow-hidden border border-border group m-0">
        {/* Background Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            isEven
              ? "from-blue-900/10 to-background"
              : "from-emerald-900/10 to-background"
          } z-0`}
          aria-hidden="true"
        />

        <motion.div
          style={{ y }}
          className="absolute inset-0 w-full h-full p-8 flex items-center justify-center z-10"
        >
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </motion.div>
      </figure>
    </article>
  );
}

export function Toolkits() {
  return (
    <section
      id="toolkits"
      className="py-20 px-6 bg-background"
      aria-labelledby="toolkits-heading"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <h2
            id="toolkits-heading"
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Professional Toolkits
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Equip yourself with the same tools used by institutional desks.
          </p>
        </header>

        <div className="space-y-24" role="list" aria-label="Professional trading tools">
          <ToolkitItem
            index={0}
            title="Risk Calculator"
            headline="Never Over-Leverage Again."
            description="Our dynamic position size calculator adjusts to live market volatility and your account balance instantly."
            imageSrc="/illustrations/risk_calculator.svg"
            imageAlt="Risk Calculator tool interface showing position sizing calculations"
          />
          <ToolkitItem
            index={1}
            title="Trade Journal"
            headline="The Professional's Edge."
            description="Track your psychological state, entry/exit logic, and performance metrics. The only way to improve is to measure."
            imageSrc="/illustrations/analytics_setup.svg"
            imageAlt="Trade Journal interface showing performance analytics and trade tracking"
          />
        </div>
      </div>
    </section>
  );
}
