"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/features/prime-landing/lib/gsap";
import { useRegion } from "@/context/RegionContext";
import { REGION_CONTENT, type PriceKey } from "@/config/pricing";
import { RegionToggle } from "@/components/RegionToggle";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";

interface Plan {
  name: string;
  tag: string;
  priceKey?: PriceKey;
  priceStatic?: string;
  unit: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Team",
    tag: "For growing teams",
    priceKey: "team_per_seat",
    unit: "",
    features: ["Up to 25 seats", "Full course catalog", "Quarterly skill reports", "Email support"],
    cta: "Start a team",
  },
  {
    name: "Enterprise",
    tag: "For organizations",
    priceStatic: "Custom",
    unit: "annual plan",
    features: ["Unlimited seats", "Dedicated learning advisor", "Custom cohorts & content", "SSO, audit, and SLA"],
    cta: "Talk to sales",
    recommended: true,
  },
  {
    name: "AI Fluency",
    tag: "For leaders, fast",
    priceKey: "ai_fluency_program",
    unit: "one-time program",
    features: ["6-week cohort", "Executive-level curriculum", "Capstone review", "Credential included"],
    cta: "Enroll",
  },
];

export function Chapter7Plans() {
  const rootRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { region } = useRegion();
  const regional = REGION_CONTENT[region];
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    // Keep cards readable at all times; animate position only.
    gsap.set(cards, { y: 18, opacity: 1 });

    const enter = gsap.to(cards, {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: root,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "center 70%",
        end: "bottom top",
        scrub: 1,
      },
    });
    // Keep side cards readable on light background.
    tl.to(cards[0], { x: -20, duration: 1, ease: "none" }, 0);
    tl.to(cards[2], { x: 20, duration: 1, ease: "none" }, 0);
    tl.to(cards[1], { scale: 1.03, duration: 1, ease: "none" }, 0);

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("plans"),
      onEnterBack: () => setChapter("plans"),
    });

    return () => {
      enter.scrollTrigger?.kill();
      enter.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      chapterTrigger.kill();
    };
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-plans"
      className="relative w-full px-6 py-36 lg:px-16"
      style={{ backgroundColor: "var(--paper)" }}
      aria-label="Plans and pricing"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Eyebrow onPaper>Plans</Eyebrow>
          <h2
            className="display mt-3"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 4.25rem)",
              color: "var(--text-primary-ink)",
            }}
          >
            Pick a{" "}
            <em className="italic" style={{ color: "var(--gold-dark)" }}>
              path
            </em>
            .
          </h2>
        </div>

        <div className="mt-12 flex justify-center">
          <RegionToggle size="md" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`relative flex flex-col rounded-2xl border p-8 lg:p-10 ${
                plan.recommended
                  ? "border-[var(--gold)] bg-[var(--ink)] text-[var(--text-primary)] shadow-[0_24px_60px_-20px_rgba(212,165,116,0.35)]"
                  : "border-[rgba(10,10,15,0.24)] bg-white/95 text-[var(--text-primary-ink)] shadow-[0_18px_50px_rgba(11,25,47,0.12)]"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ink)]">
                  Recommended
                </span>
              )}
              <div>
                <h3
                  className="display"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1 }}
                >
                  {plan.name}
                </h3>
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: plan.recommended ? "var(--text-secondary)" : "var(--text-secondary-ink)",
                  }}
                >
                  {plan.tag}
                </p>
              </div>
              <div className="mt-8">
                <span
                  className="display block whitespace-nowrap leading-none"
                  style={{ fontSize: "clamp(1.375rem, 4.2vw, 2.25rem)" }}
                >
                  {plan.priceKey ? (
                    <PriceDisplay priceKey={plan.priceKey} />
                  ) : (
                    plan.priceStatic
                  )}
                </span>
                {plan.unit && (
                  <span
                    className="ml-2 text-sm"
                    style={{
                      color: plan.recommended ? "var(--text-secondary)" : "var(--text-secondary-ink)",
                    }}
                  >
                    {plan.unit}
                  </span>
                )}
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--gold)]" />
                    <span
                      style={{
                        color: plan.recommended ? "var(--text-primary)" : "var(--text-primary-ink)",
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button variant={plan.recommended ? "primary" : "gold"} className="w-full">
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-10 text-center text-sm"
          style={{ color: "var(--text-secondary-ink)" }}
        >
          {regional.paymentNote}
        </p>
      </div>
    </section>
  );
}
