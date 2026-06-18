"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/features/prime-landing/lib/gsap";
import { useRegion } from "@/context/RegionContext";
import { REGION_CONTENT } from "@/config/pricing";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";

const TRACKS = [
  {
    tag: "Track 01",
    title: "The Agentic AI Builders",
    subtitle: "Zero to Deployed",
    meta: "7 Phases · 50 Sessions",
    phases: [
      { code: "P0", name: "Onboarding", deliverable: "Environment setup" },
      { code: "P1", name: "Python for AI", deliverable: "CLI Tool (Capstone)" },
      { code: "P2", name: "LLM Foundations", deliverable: "API Wrappers" },
      { code: "P3", name: "Data & Embeddings", deliverable: "Feeds Phase 4" },
      { code: "P4", name: "RAG Mastery", deliverable: "RAG Pipeline (Capstone)" },
      {
        code: "P5",
        name: "Agents & Agentic AI",
        deliverable: "Multi-Agent (Capstone)",
      },
      {
        code: "P6",
        name: "Vibe-Coding & Shipping",
        deliverable: "Deployed Product (Capstone)",
      },
    ],
    footer:
      "9 Portfolio Projects · Every project ships · Session 49 = Your first live AI product",
  },
  {
    tag: "Track 02",
    title: "The Global AI Generalist",
    subtitle: "Zero to Deployed",
    meta: "5 Modules · 25 Sessions",
    phases: [
      {
        code: "M1",
        name: "Prompt Engineering + RAG",
        deliverable: "AI Concierge + RAG Chatbot",
      },
      {
        code: "M2",
        name: "Automations Foundations",
        deliverable: "Business Workflow Live",
      },
      {
        code: "M3",
        name: "Automations Advanced",
        deliverable: "AI Agent Running",
      },
      { code: "M4", name: "Vibe-Coding", deliverable: "Moris Eats Web App" },
      {
        code: "M5",
        name: "Deployments + Emergent",
        deliverable: "Live URL + Mobile App",
      },
    ],
    footer: "Every session ships something · Session 25 = your product, live",
  },
];

const PILLARS = [
  {
    title: "The Capability Gap",
    body: "Why most organizations stall at the PoC stage and never reach production deployment.",
  },
  {
    title: "Production AI Systems",
    body: "A deep dive into RAG pipelines, AI agents, and real-time orchestration in live environments.",
  },
  {
    title: "The Work-with-AI Multiplier",
    body: "Transform your existing bench into AI system builders who navigate ambiguity end-to-end.",
  },
];

const STATS = [
  { value: "73%", label: "of roles require Agentic AI" },
  { value: "61%", label: "require RAG systems" },
  { value: "Demand › Supply", label: "AI hiring outpaces talent supply" },
];

const FLOW = [
  { step: "01", title: "Prompt", body: "Start from a single instruction." },
  { step: "02", title: "Agent", body: "Wrap context, tools, memory." },
  { step: "03", title: "Multi-Agent System", body: "Orchestrate to a live endpoint." },
];

/**
 * Chapter - Agentic AI Cohort.
 *
 * Flagship-event spotlight (closed-door executive session). Pure ink theme,
 * composed of: hero block, dual-region session badges, three pillars, three
 * trend stats, the prompt → agent → multi-agent flow, and a closing quote + CTA panel.
 *
 * Self-registers with the scroll store ("cohort") so BackgroundCanvas stays
 * on the ink palette while this section is in view.
 */
export function ChapterAgenticAICohort() {
  const rootRef = useRef<HTMLElement>(null);
  const { region } = useRegion();
  const regional = REGION_CONTENT[region];
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Reveal-on-enter. NOTE: we deliberately do NOT pre-hide elements with
      // gsap.set() - if ScrollTrigger.batch fails to fire for any reason
      // (stale build, scroll position at mount, Lenis race, etc.) the
      // section would render invisibly. Using fromTo inside onEnter means
      // content is visible by default and the animation is purely additive.
      const reveals = root.querySelectorAll<HTMLElement>("[data-cohort-reveal]");
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "expo.out",
            }
          ),
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => setChapter("cohort"),
        onEnterBack: () => setChapter("cohort"),
      });
    }, root);

    return () => ctx.revert();
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-cohort"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-16 lg:py-32"
      style={{ backgroundColor: "var(--ink)" }}
      aria-label="Agentic AI Playbook, Closed-Door Cohort"
    >
      {/* Subtle ambient gold glow + grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, rgba(224,180,88,0.10) 0%, transparent 60%), radial-gradient(50% 40% at 0% 100%, rgba(37,99,235,0.10) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ───────── HERO ───────── */}
        <div data-cohort-reveal className="flex flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/50 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--gold-bright)]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--gold-bright)]" />
            Closed-Door Invite
          </span>
          <Eyebrow>Flagship Cohort · Agentic AI Playbook</Eyebrow>
        </div>

        <h2
          data-cohort-reveal
          className="display mt-5 max-w-[20ch]"
          style={{
            fontSize: "clamp(2.25rem, 6vw, 4.75rem)",
            color: "var(--text-primary)",
          }}
        >
          From AI experimentation to{" "}
          <em className="italic text-[var(--gold)]">production capability</em>.
        </h2>

        <p
          data-cohort-reveal
          className="mt-6 max-w-3xl text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          The $250 billion IT Services industry is facing a structural reset.
          The gap between knowing AI exists and knowing how to direct it is the
          most expensive gap in the industry today. This cohort is the blueprint
          for moving beyond AI tools to building and deploying production AI
          systems that ship outcomes.
        </p>

        {/* ───────── PROGRAMME TRACKS ───────── */}
        <div
          data-cohort-reveal
          className="mt-12 flex items-center gap-3"
        >
          <Eyebrow>Two programme tracks</Eyebrow>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {TRACKS.map((f) => (
            <article
              key={f.title}
              data-cohort-reveal
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--fog)]/80 bg-[var(--mist)]/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-[var(--gold)]/60 sm:p-8"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--gold-bright)]">
                  {f.tag}
                </span>
                <span className="rounded-full border border-[var(--fog)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  {f.subtitle}
                </span>
              </div>
              <h3
                className="display mt-4 text-2xl sm:text-[1.7rem]"
                style={{ color: "var(--text-primary)", lineHeight: 1.15 }}
              >
                {f.title}
              </h3>
              <p
                className="mt-2 text-sm uppercase tracking-[0.18em]"
                style={{ color: "var(--text-secondary)" }}
              >
                {f.meta}
              </p>

              <ul className="mt-6 flex flex-col divide-y divide-[var(--fog)]/60 border-y border-[var(--fog)]/60">
                {f.phases.map((p) => (
                  <li
                    key={p.code}
                    className="flex items-center gap-4 py-3 text-sm"
                  >
                    <span
                      className="display shrink-0 text-base tracking-wide"
                      style={{ color: "var(--gold-bright)", minWidth: "2.25rem" }}
                    >
                      {p.code}
                    </span>
                    <span
                      className="flex-1 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p.name}
                    </span>
                    <span
                      className="hidden text-xs sm:inline"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {p.deliverable}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className="mt-5 text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {f.footer}
              </p>
            </article>
          ))}
        </div>

        {/* ───────── PILLARS ───────── */}
        <div className="mt-20">
          <Eyebrow>Key session pillars</Eyebrow>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {PILLARS.map((p, i) => (
              <article
                key={p.title}
                data-cohort-reveal
                className="group relative flex h-full flex-col rounded-2xl border border-[var(--fog)]/70 bg-[rgba(255,255,255,0.02)] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--gold)]/50 hover:bg-[rgba(255,255,255,0.04)]"
              >
                <span
                  className="display text-3xl"
                  style={{ color: "var(--gold-bright)" }}
                >
                  0{i + 1}
                </span>
                <h3
                  className="headline mt-4 text-xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* ───────── STATS ───────── */}
        <div className="mt-20">
          <Eyebrow>Key AI trends</Eyebrow>
          <h3
            data-cohort-reveal
            className="display mt-3 max-w-[24ch]"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              color: "var(--text-primary)",
            }}
          >
            The problem most organizations face.
          </h3>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--fog)]/80 bg-[var(--fog)]/80 sm:grid-cols-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                data-cohort-reveal
                className="flex flex-col gap-3 bg-[var(--ink)] p-6 sm:p-8"
              >
                <span
                  className="display"
                  style={{
                    fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                    color: "var(--gold-bright)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <ul
            className="mt-6 grid gap-2 text-sm sm:grid-cols-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            {[
              "Teams use AI tools but cannot build systems",
              "AI initiatives stall at the PoC stage",
              "Hiring AI talent is expensive and slow",
            ].map((line) => (
              <li
                key={line}
                data-cohort-reveal
                className="flex items-start gap-2"
              >
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* ───────── LIVE DEMO FLOW ───────── */}
        <div className="mt-20">
          <Eyebrow>Live demonstration</Eyebrow>
          <h3
            data-cohort-reveal
            className="display mt-3 max-w-[28ch]"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              color: "var(--text-primary)",
            }}
          >
            Watch a multi-agent system get built live, in real time.
          </h3>
          <p
            data-cohort-reveal
            className="mt-3 max-w-2xl text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            From a single prompt to an orchestrated multi-agent system deployed
            to a live production endpoint. A working view into how AI systems
            are actually built.
          </p>

          <div className="relative mt-10">
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-[34px] hidden h-px md:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, var(--gold) 15%, var(--gold) 85%, transparent 100%)",
                opacity: 0.5,
              }}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {FLOW.map((f) => (
                <div
                  key={f.title}
                  data-cohort-reveal
                  className="flex flex-col items-start gap-4"
                >
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-[var(--gold)]/60 bg-[var(--ink)] shadow-[0_0_0_4px_var(--ink)]">
                    <span
                      className="display text-xl"
                      style={{ color: "var(--gold-bright)" }}
                    >
                      {f.step}
                    </span>
                  </div>
                  <h4
                    className="headline text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───────── QUOTE + CTA ───────── */}
        <div
          data-cohort-reveal
          className="mt-20 overflow-hidden rounded-[2rem] border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--mist)] to-[var(--ink)] p-8 sm:p-12"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <blockquote
              className="display"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.2,
                color: "var(--text-primary)",
              }}
            >
              <span
                aria-hidden="true"
                className="mr-2 align-top text-[var(--gold)]"
              >
                “
              </span>
              AI will not replace your team.{" "}
              <span className="text-[var(--gold-bright)]">
                Teams that can build AI will.
              </span>
            </blockquote>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Button
                as="a"
                href="https://paet.ltd/"
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                {regional.applyCta}
              </Button>
              <Button
                as="a"
                href="https://paet.ltd/"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
              >
                Explore the Curriculum
              </Button>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: "var(--text-tertiary)" }}
              >
                India enquiries ·{" "}
                <a
                  href="mailto:learning@primelearning.ae"
                  className="hover:text-[var(--gold-bright)] transition-colors"
                >
                  learning@primelearning.ae
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

