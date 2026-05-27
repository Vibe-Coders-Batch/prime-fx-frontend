"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/features/prime-landing/lib/gsap";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";

type Course = {
  track: string;
  title: string;
  focus: string;
  description: string;
  meta: string;
  modules: { name: string; deliverable: string }[];
  footer: string;
};

/**
 * Trainer-led course tracks. Content sourced from the Agentic AI Playbook
 * one-pager (A-2). "Fellowship" is intentionally renamed to "Cohort".
 */
const COURSES: Course[] = [
  {
    track: "Track 01",
    title: "Agentic AI Builders Cohort",
    focus: "Deep Technical",
    description:
      "A zero-to-deployed build journey from foundations to RAG pipelines, agents, multi-agent workflows, and a shipped AI product.",
    meta: "7 Modules · 49 Sessions",
    modules: [
      { name: "Onboarding", deliverable: "Setup" },
      { name: "Python for AI", deliverable: "CLI Tool" },
      { name: "LLM Foundations", deliverable: "API Wrapper" },
      { name: "Data & Embeddings", deliverable: "Pipeline" },
      { name: "RAG Mastery", deliverable: "RAG System" },
      { name: "Agents & Agentic AI", deliverable: "MultiAgent" },
      { name: "VibeCoding & Ship", deliverable: "Live Product" },
    ],
    footer: "49 Sessions · first live AI product · 9 portfolio projects",
  },
  {
    track: "Track 02",
    title: "AI Generalist Global Cohort",
    focus: "Broad AI Fluency",
    description:
      "A practical adoption pathway for prompt engineering, RAG-enabled workflows, automation fluency, live app delivery, and cross-functional AI confidence.",
    meta: "5 Modules · 25 Sessions",
    modules: [
      { name: "Prompt Engineering + RAG", deliverable: "AI Concierge + RAG Chatbot" },
      { name: "Automations Foundations", deliverable: "Business Workflow Live" },
      { name: "Automations Advanced", deliverable: "AI Agent Running" },
      { name: "Vibe-Coding", deliverable: "Web App Delivered" },
      { name: "Deployments + Emergent", deliverable: "Live URL + Mobile App" },
    ],
    footer: "25 Sessions · product live · AI concierge · RAG chatbot · workflow agents",
  },
];

export function ChapterTrainerLedCourses() {
  const rootRef = useRef<HTMLElement>(null);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Additive reveal — content is visible by default; the animation only
      // enhances it (see ChapterAgenticAICohort for the rationale).
      const reveals = root.querySelectorAll<HTMLElement>("[data-course-reveal]");
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "expo.out" }
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
      aria-label="Trainer-led courses"
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, rgba(224,180,88,0.10) 0%, transparent 60%), radial-gradient(50% 40% at 0% 100%, rgba(37,99,235,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ───────── HEADER ───────── */}
        <div data-course-reveal>
          <Eyebrow>Trainer-Led Courses</Eyebrow>
        </div>
        <h2
          data-course-reveal
          className="display mt-5 max-w-[20ch]"
          style={{
            fontSize: "clamp(2.25rem, 6vw, 4.75rem)",
            color: "var(--text-primary)",
          }}
        >
          Two cohorts. Every session{" "}
          <em className="italic text-[var(--gold)]">ships something real</em>.
        </h2>
        <p
          data-course-reveal
          className="mt-6 max-w-3xl text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          Live, trainer-led programmes that move you from foundations to a deployed
          AI product. Pick the depth-first build track or the broad fluency track —
          both end with shipped, production-grade work, not just a certificate.
        </p>

        {/* ───────── COURSE TRACKS ───────── */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {COURSES.map((c) => (
            <article
              key={c.title}
              data-course-reveal
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--fog)]/80 bg-[var(--mist)]/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-[var(--gold)]/60 sm:p-8"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--gold-bright)]">
                  {c.track}
                </span>
                <span className="rounded-full border border-[var(--fog)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  {c.focus}
                </span>
              </div>

              <h3
                className="display mt-4 text-2xl sm:text-[1.7rem]"
                style={{ color: "var(--text-primary)", lineHeight: 1.15 }}
              >
                {c.title}
              </h3>
              <p
                className="mt-2 text-xs uppercase tracking-[0.18em]"
                style={{ color: "var(--gold-bright)" }}
              >
                {c.meta}
              </p>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {c.description}
              </p>

              <ul className="mt-6 flex flex-col divide-y divide-[var(--fog)]/60 border-y border-[var(--fog)]/60">
                {c.modules.map((m, i) => (
                  <li key={m.name} className="flex items-center gap-4 py-3 text-sm">
                    <span
                      className="display shrink-0 text-base tracking-wide"
                      style={{ color: "var(--gold-bright)", minWidth: "1.75rem" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="flex-1 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {m.name}
                    </span>
                    <span
                      className="hidden text-xs sm:inline"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {m.deliverable}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className="mt-5 text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {c.footer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
