"use client";

import { useEffect, useRef } from "react";
import { TeamPortraitImage } from "@/components/marketing/TeamPortraitImage";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
} from "@/features/prime-landing/lib/gsap";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { LEADERSHIP_TEAM, type LeadershipMember } from "@/data/leadership-team";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import Link from "next/link";

/** A single person: circular portrait + name + role. */
function TeamNode({
  member,
  priority = false,
}: {
  member: LeadershipMember;
  priority?: boolean;
}) {
  return (
    <div
      data-team-node
      className="group flex w-full max-w-[10rem] flex-col items-center px-1 text-center"
    >
      <div
        className="relative h-24 w-24 overflow-hidden rounded-full sm:h-36 sm:w-36 lg:h-44 lg:w-44"
        style={{
          border: "1px solid rgba(212,175,55,0.35)",
          boxShadow:
            "0 18px 40px -18px rgba(0,0,0,0.55), inset 0 0 0 4px rgba(11,25,47,0.85)",
          background:
            "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.18), rgba(11,25,47,0) 70%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={
            member.portraitZoom
              ? {
                  transform: `scale(${member.portraitZoom})`,
                  transformOrigin: "50% 0%",
                }
              : undefined
          }
        >
          <TeamPortraitImage
            src={member.portrait}
            alt={`${member.name}, ${member.role}`}
            fill
            sizes="(max-width: 640px) 6rem, 11rem"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            priority={priority}
          />
        </div>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, rgba(11,25,47,0.45), transparent 55%)",
          }}
        />
      </div>

      <h3
        className="display mt-4 text-sm leading-tight sm:text-base lg:text-lg"
        style={{ color: "var(--gold-bright)" }}
      >
        {member.name}
      </h3>
      <p
        className="mt-1 text-[11px] leading-snug sm:text-xs lg:text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {member.role}
      </p>
    </div>
  );
}

export function ChapterCoreTeam() {
  const rootRef = useRef<HTMLElement>(null);
  const setChapter = useScrollStore((s) => s.setChapter);

  // Top tier: first three. Bottom tier: remaining members.
  const topRow = LEADERSHIP_TEAM.slice(0, 3);
  const bottomRow = LEADERSHIP_TEAM.slice(3);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Additive reveal: nodes are visible by default; the scroll-in only
      // enhances them, so a missed ScrollTrigger never hides the tree.
      const reveals = root.querySelectorAll<HTMLElement>(
        "[data-team-reveal], [data-team-node]"
      );
      ScrollTrigger.batch(reveals, {
        start: "top 88%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "expo.out" }
          ),
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top center",
        end: "bottom center",
        onEnter: () => setChapter("core-team"),
        onEnterBack: () => setChapter("core-team"),
      });
    }, root);

    return () => ctx.revert();
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
        <div data-team-reveal className="mx-auto max-w-3xl text-center">
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

        {/* ───────── 3 on top → 3 below ───────── */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="flex items-start">
            {topRow.map((m) => (
              <div key={m.name} className="flex flex-1 flex-col items-center">
                <TeamNode member={m} priority />
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-start sm:mt-16">
            {bottomRow.map((m) => (
              <div key={m.name} className="flex flex-1 flex-col items-center">
                <TeamNode member={m} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
