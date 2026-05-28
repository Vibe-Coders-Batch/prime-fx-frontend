"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TeamPortraitImage } from "@/components/marketing/TeamPortraitImage";
import type { LeadershipMember } from "@/data/leadership-team";
import { fadeUp, defaultTransition, springTransition } from "@/lib/marketing-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LeadershipPersonCardProps = {
  member: LeadershipMember;
  priority?: boolean;
};

export function LeadershipPersonCard({ member, priority = false }: LeadershipPersonCardProps) {
  const { name, role, portrait, summary, highlights, portraitZoom } = member;
  const visibleHighlights = highlights.slice(0, 3);
  const moreCount = Math.max(0, highlights.length - visibleHighlights.length);
  const [open, setOpen] = useState(false);
  const descriptionId = useMemo(
    () => `leadership-card-${name.toLowerCase().replace(/\s+/g, "-")}-description`,
    [name]
  );

  return (
    <motion.figure
      variants={fadeUp}
      transition={defaultTransition}
      className="group cursor-default"
    >
      <motion.div whileHover={{ y: -6 }} transition={springTransition}>
        <div
          tabIndex={0}
          role="button"
          aria-label={`View details for ${name}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? descriptionId : undefined}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
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
              className="object-cover grayscale transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03] group-hover:grayscale-0 group-focus-within:grayscale-0"
              priority={priority}
            />
          </div>

          {/* Default dark overlay (keeps the pre-hover look) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/50 transition-opacity duration-500 ease-out group-hover:opacity-0 group-focus-within:opacity-0"
          />

          {/* Hover / focus panel (bottom sheet so photo stays visible) */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col p-4 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.72) 55%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden="true"
          >
            <div className="mb-3 h-px w-10 origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100" />
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold-bright)]">
              {role}
            </p>
            <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-[var(--text-primary)]">
              {summary}
            </p>
            <ul className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
              {visibleHighlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {moreCount > 0 ? (
              <p className="mt-2 text-[11px] text-[var(--text-tertiary)]">
                + {moreCount} more
              </p>
            ) : null}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          id={descriptionId}
          className="max-w-3xl overflow-hidden border border-white/10 bg-[var(--ink)] p-0 text-white"
        >
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[320px_1fr]">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--mist)] md:aspect-auto md:min-h-[480px]">
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
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                  priority={priority}
                />
              </div>
              <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
            </div>

            <div className="p-6 md:p-8">
              <DialogHeader>
                <DialogTitle className="display text-2xl md:text-3xl" style={{ color: "var(--text-primary)" }}>
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm md:text-base" style={{ color: "var(--gold-bright)" }}>
                  {role}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <p className="text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
                  {summary}
                </p>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--text-tertiary)" }}>
                    Focus areas
                  </p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {highlights.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.figure>
  );
}
