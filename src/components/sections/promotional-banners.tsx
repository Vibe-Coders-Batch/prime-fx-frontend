"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  pillars: string[];
  tagline: string;
  ctaLabel: string;
};

const REGISTER_URL = "https://www.paet.ltd";
const AUTOPLAY_MS = 6500;

const BANNERS: Banner[] = [
  {
    id: "agentic-playbook",
    badge: "Closed-Door Executive Invite",
    titlePrefix: "Agentic AI Playbook — ",
    titleHighlight: "From Experimentation to Production Capability",
    subtitle:
      "Close the most expensive gap in the $250B IT Services industry — knowing AI exists vs. knowing how to direct it. A practitioner-led blueprint for teams that actually ship production AI.",
    pillars: [
      "Live Multi-Agent Build",
      "RAG Systems Deep Dive",
      "Led by Ex-Microsoft & Dell",
    ],
    tagline: "“AI will not replace your team. Teams that can build AI will.”",
    ctaLabel: "Register Now",
  },
  {
    id: "execution-layer",
    badge: "Leadership Roundtable",
    titlePrefix: "Redefining the ",
    titleHighlight: "Execution Layer of IT Services",
    subtitle:
      "Move from Workforce Provider to Innovation Partner. The playbook to direct AI system architecture — not just manage headcount — as clients stop asking for low-cost resources and start asking why humans are in the loop at all.",
    pillars: [
      "3 Specialists · 1 Output",
      "7-Phase Execution Roadmap",
      "9 Real-World AI Projects",
    ],
    tagline:
      "From managing people to directing systems — the next decade of IT leadership.",
    ctaLabel: "Register Now",
  },
  {
    id: "career-launchpad",
    badge: "The Career Launchpad",
    titlePrefix: "Build What the Industry ",
    titleHighlight: "Actually Hires For",
    subtitle:
      "73% of roles now demand Agentic AI capability and 61% require RAG systems. Go beyond tools — ship live, verifiable AI products mentored by technocrats who’ve architected platforms handling 1.3M+ daily transactions.",
    pillars: [
      "Zero → Deployed AI Product",
      "Portfolio of Live URLs",
      "Practitioner-Led Cohort",
    ],
    tagline: "A skill is a hobby. A live URL is a product.",
    ctaLabel: "Register Now",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary-gold/30 bg-primary-gold/10 px-3.5 py-1.5 text-xs font-semibold text-primary-gold backdrop-blur-sm sm:text-[13px]">
      {children}
    </span>
  );
}

function BannerCard({ banner }: { banner: Banner }) {
  return (
    <div className="relative w-full bg-[#0a192f]">
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[22rem] w-[44rem] -translate-x-1/2 rounded-full bg-primary-gold/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[18rem] w-[36rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-blue-600/10 blur-3xl"
      />

      {/* Centered content wrapper — generous top padding to clear the fixed navbar (up to ~112px tall) */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 pb-24 pt-28 text-center sm:gap-7 sm:px-8 sm:pb-28 sm:pt-32 md:pt-36 lg:pt-40">
        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-sm sm:text-xs">
          {banner.badge}
        </span>

        {/* Title */}
        <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[56px] lg:leading-[1.08]">
          <span className="text-white">{banner.titlePrefix}</span>
          <span className="text-primary-gold">{banner.titleHighlight}</span>
        </h2>

        {/* Subtitle */}
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
          {banner.subtitle}
        </p>

        {/* Pillars */}
        <div className="mt-1 flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {banner.pillars.map((p) => (
            <Pill key={p}>{p}</Pill>
          ))}
        </div>

        {/* Tagline / quote */}
        <p className="mx-auto max-w-2xl pt-2 text-sm italic text-white/80 sm:text-base md:text-lg">
          {banner.tagline}
        </p>

        {/* CTA — centered, high-contrast */}
        <div className="pt-2">
          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${banner.ctaLabel} — opens paet.ltd in a new tab`}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_-10px_rgba(245,158,11,0.55)] ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:from-[#fbbf24] hover:to-[#f59e0b] hover:shadow-[0_16px_40px_-10px_rgba(251,191,36,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a192f] sm:text-base"
          >
            <span>{banner.ctaLabel}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export function PromotionalBanners() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused]);

  const goTo = (index: number) => {
    const n = BANNERS.length;
    setActiveIndex(((index % n) + n) % n);
  };

  return (
    <section
      aria-label="Featured Prime Learning sessions"
      className="relative w-full bg-[#0a192f]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Grid-stacked slides — all share one cell so the container sizes to the tallest slide,
          preventing any content (including the CTA) from being clipped at small heights. */}
      <div className="relative grid">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={[
              "col-start-1 row-start-1 transition-opacity duration-700",
              index === activeIndex
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0",
            ].join(" ")}
            aria-hidden={index !== activeIndex}
          >
            <BannerCard banner={banner} />
          </div>
        ))}

        {/* Prev / Next controls */}
        {BANNERS.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous banner"
              className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold sm:inline-flex sm:left-4 sm:h-11 sm:w-11"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next banner"
              className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold sm:inline-flex sm:right-4 sm:h-11 sm:w-11"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {BANNERS.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6">
            {BANNERS.map((b, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Go to banner ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => goTo(index)}
                  className={[
                    "h-2.5 rounded-full border border-white/40 transition-all",
                    isActive
                      ? "w-8 bg-primary-gold"
                      : "w-2.5 bg-white/30 hover:bg-white/60",
                  ].join(" ")}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
