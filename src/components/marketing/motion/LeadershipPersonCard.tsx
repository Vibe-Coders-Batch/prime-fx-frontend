"use client";

import { motion } from "framer-motion";
import { TeamPortraitImage } from "@/components/marketing/TeamPortraitImage";
import type { LeadershipMember } from "@/data/leadership-team";
import { fadeUp, defaultTransition, springTransition } from "@/lib/marketing-motion";

type LeadershipPersonCardProps = {
  member: LeadershipMember;
  priority?: boolean;
};

export function LeadershipPersonCard({ member, priority = false }: LeadershipPersonCardProps) {
  const { name, role, portrait, summary, highlights, portraitZoom } = member;

  return (
    <motion.figure
      variants={fadeUp}
      transition={defaultTransition}
      className="group cursor-default"
    >
      <motion.div whileHover={{ y: -6 }} transition={springTransition}>
        <div
          tabIndex={0}
          className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-white/10 outline-none transition-[box-shadow,ring-color] duration-500 group-hover:ring-[var(--gold)]/45 group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.45)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--gold)]"
          style={{ backgroundColor: "var(--mist)" }}
        >
          <div
            className="absolute inset-0"
            style={
              portraitZoom
                ? {
                    transform: `scale(${portraitZoom})`,
                    transformOrigin: "50% 20%",
                  }
                : undefined
            }
          >
            <TeamPortraitImage
              src={portrait}
              alt={`${name} — ${role}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
              priority={priority}
            />
          </div>

          {/* Hover / focus panel */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/92 to-[var(--ink)]/25 p-4 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:from-[var(--ink)]/95"
            aria-hidden="true"
          >
            <div
              className="mb-3 h-px w-10 origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100 [@media(hover:none)]:scale-x-100"
            />
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold-bright)]">
              {role}
            </p>
            <p className="mt-2 line-clamp-3 text-[13px] leading-snug text-[var(--text-primary)]">
              {summary}
            </p>
            <ul className="mt-3 max-h-[9.5rem] space-y-1.5 overflow-y-auto pr-1 text-[11px] leading-relaxed text-[var(--text-secondary)] [scrollbar-width:thin] [scrollbar-color:rgba(224,180,88,0.35)_transparent]">
              {highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Screen-reader accessible full bio */}
          <span className="sr-only">
            {name}, {role}. {summary}{" "}
            {highlights.join(" ")}
          </span>
        </div>
      </motion.div>

      <figcaption className="mt-4 px-0.5">
        <div className="font-medium" style={{ color: "var(--text-primary)" }}>
          {name}
        </div>
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {role}
        </div>
        <p
          className="mt-2 hidden text-xs leading-relaxed sm:block lg:hidden"
          style={{ color: "var(--text-secondary)" }}
        >
          {summary}
        </p>
      </figcaption>
    </motion.figure>
  );
}
