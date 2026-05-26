"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
} from "@/features/prime-landing/lib/gsap";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { LEADERSHIP_TEAM } from "@/data/leadership-team";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import Link from "next/link";

export function ChapterCoreTeam() {
  const rootRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 40 });
      gsap.set(cardsRef.current.filter(Boolean) as HTMLElement[], {
        opacity: 0,
        y: 30,
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(headerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
          });
          gsap.to(cardsRef.current.filter(Boolean) as HTMLElement[], {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.08,
            delay: 0.15,
          });
        },
      });
    }, root);

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("core-team"),
      onEnterBack: () => setChapter("core-team"),
    });

    return () => {
      ctx.revert();
      chapterTrigger.kill();
    };
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-core-team"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: "var(--ink)" }}
      aria-label="Core team and mentors"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <Eyebrow>Leadership</Eyebrow>
          <h2
            className="display mt-6"
            style={{
              fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
              lineHeight: 1.1,
              color: "var(--gold-bright)",
            }}
          >
            Prime Learning Core Team
          </h2>
          <p
            className="mt-5 mx-auto max-w-xl text-base sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            The mentors and operators behind the programme. They set the bar for
            the cohorts, hire the faculty, and run the school day to day.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/leadership"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--gold-bright)] transition-opacity hover:opacity-80"
            >
              Leadership
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/spotlight"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--gold-bright)] transition-opacity hover:opacity-80"
            >
              Spotlight
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <ul
          className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {LEADERSHIP_TEAM.map((m, i) => (
            <li
              key={m.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="group flex flex-col items-center text-center"
            >
              <div
                className="relative h-44 w-44 overflow-hidden rounded-full sm:h-52 sm:w-52"
                style={{
                  border: "1px solid rgba(212,175,55,0.35)",
                  boxShadow:
                    "0 18px 40px -18px rgba(0,0,0,0.55), inset 0 0 0 4px rgba(11,25,47,0.85)",
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.18), rgba(11,25,47,0) 70%)",
                }}
              >
                <Image
                  src={m.portrait}
                  alt={`${m.name} — ${m.role}`}
                  fill
                  sizes="(max-width: 640px) 11rem, 13rem"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  priority={i < 3}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 100%, rgba(11,25,47,0.45), transparent 55%)",
                  }}
                />
              </div>

              <h3
                className="display mt-6 text-lg sm:text-xl"
                style={{ color: "var(--gold-bright)" }}
              >
                {m.name}
              </h3>
              <p
                className="mt-1 text-sm sm:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                {m.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
