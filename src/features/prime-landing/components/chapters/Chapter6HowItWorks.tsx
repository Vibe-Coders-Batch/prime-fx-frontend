"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/features/prime-landing/lib/gsap";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";

const STEPS = [
  {
    title: "Browse",
    blurb:
      "Start with the catalog. Filter by career stage, commitment, or category. Every course has a clear outcome attached.",
  },
  {
    title: "Enroll",
    blurb:
      "Pick your pace. Live cohorts run weekly; self-paced tracks stay open. One click, and you're in.",
  },
  {
    title: "Earn Certificate",
    blurb:
      "Ship real work, get reviewed, and walk away with a credential recruiters recognize. Built in India & the UAE. Recognized everywhere.",
  },
];

const PIN_VH = 200;

export function Chapter6HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const illoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeStepRef = useRef<number>(-1);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const titles = titleRefs.current.filter(Boolean) as HTMLElement[];
    const illos = illoRefs.current.filter(Boolean) as HTMLElement[];
    if (titles.length < 3 || illos.length < 3) return;

    const ctx = gsap.context(() => {
      const browseCards =
        illos[0].querySelectorAll<HTMLElement>("[data-browse-card]");
      const enrollBar = illos[1].querySelector<HTMLElement>("[data-enroll-bar]");
      const enrollPct = illos[1].querySelector<HTMLElement>("[data-enroll-pct]");
      const certPieces =
        illos[2].querySelectorAll<HTMLElement>("[data-cert-piece]");
      const certStamp =
        illos[2].querySelector<HTMLElement>("[data-cert-stamp]");

      gsap.set(titles, {
        opacity: 0.4,
        scale: 0.95,
        transformOrigin: "left center",
      });
      gsap.set(titles[0], { opacity: 1, scale: 1 });

      gsap.set(illos, { opacity: 0, y: 20 });
      gsap.set(illos[0], { opacity: 1, y: 0 });

      gsap.set(browseCards, { y: 40, opacity: 0, rotate: -4 });
      if (enrollBar)
        gsap.set(enrollBar, { scaleX: 0, transformOrigin: "left" });
      if (enrollPct) enrollPct.textContent = "0%";
      gsap.set(certPieces, { opacity: 0, y: 20 });
      if (certStamp) gsap.set(certStamp, { scale: 0, opacity: 0, rotate: -12 });

      const activateStep = (i: number) => {
        if (activeStepRef.current === i) return;
        activeStepRef.current = i;

        titles.forEach((t, j) => {
          gsap.to(t, {
            opacity: j === i ? 1 : 0.4,
            scale: j === i ? 1 : 0.95,
            duration: 0.5,
            ease: "expo.out",
            overwrite: "auto",
          });
        });

        illos.forEach((il, j) => {
          gsap.to(il, {
            opacity: j === i ? 1 : 0,
            y: j === i ? 0 : 20,
            duration: 0.55,
            ease: "expo.out",
            overwrite: "auto",
          });
        });

        if (i === 0) {
          gsap.set(browseCards, { y: 40, opacity: 0, rotate: -4 });
          gsap.to(browseCards, {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "expo.out",
            overwrite: "auto",
          });
        }
        if (i === 1) {
          if (enrollBar) {
            gsap.set(enrollBar, { scaleX: 0 });
            gsap.to(enrollBar, {
              scaleX: 1,
              duration: 1.4,
              ease: "expo.out",
              overwrite: "auto",
            });
          }
          if (enrollPct) {
            enrollPct.textContent = "0%";
            const state = { n: 0 };
            gsap.to(state, {
              n: 100,
              duration: 1.4,
              ease: "expo.out",
              onUpdate: () => {
                enrollPct.textContent = `${Math.round(state.n)}%`;
              },
              overwrite: "auto",
            });
          }
        }
        if (i === 2) {
          gsap.set(certPieces, { opacity: 0, y: 20 });
          gsap.to(certPieces, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "expo.out",
            overwrite: "auto",
          });
          if (certStamp) {
            gsap.set(certStamp, { scale: 0, opacity: 0, rotate: -12 });
            gsap.to(certStamp, {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.9,
              delay: 0.6,
              ease: "back.out(3)",
              overwrite: "auto",
            });
          }
        }
      };

      const pinTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (PIN_VH / 100)}`,
        pin: true,
        pinType: "transform",
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const stepIndex = Math.min(
            STEPS.length - 1,
            Math.max(0, Math.floor(self.progress * STEPS.length))
          );
          activateStep(stepIndex);
        },
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top center",
        end: `+=${(PIN_VH + 100) * 0.01 * window.innerHeight}`,
        onEnter: () => setChapter("how"),
        onEnterBack: () => setChapter("how"),
      });

      ScrollTrigger.refresh();
      const p = pinTrigger.progress;
      const initialStep = Math.min(
        STEPS.length - 1,
        Math.max(0, Math.floor(p * STEPS.length))
      );
      activateStep(initialStep);
    }, root);

    return () => ctx.revert();
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-how"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "var(--ink)" }}
      aria-label="How it works"
    >
      <div className="mx-auto grid h-[100svh] w-full max-w-7xl grid-cols-1 gap-12 px-6 pt-28 lg:grid-cols-[40%_1fr] lg:px-16">
        <div className="flex flex-col justify-center gap-8">
          <Eyebrow>How it works</Eyebrow>
          <h2
            className="display"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              color: "var(--text-primary)",
            }}
          >
            From curious to{" "}
            <em className="italic text-[var(--gold)]">credentialed</em>.
          </h2>
          <ul className="mt-4 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  ref={(el) => {
                    titleRefs.current[i] = el;
                  }}
                  className="flex flex-col items-start text-left"
                >
                  <span className="text-sm text-[var(--gold-bright)]">
                    0{i + 1}
                  </span>
                  <h3
                    className="display"
                    style={{
                      fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                      lineHeight: 1,
                      color: "var(--text-primary)",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-3 max-w-md text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.blurb}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            ref={(el) => {
              illoRefs.current[0] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <BrowseIllustration />
          </div>
          <div
            ref={(el) => {
              illoRefs.current[1] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <EnrollIllustration />
          </div>
          <div
            ref={(el) => {
              illoRefs.current[2] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CertificateIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function BrowseIllustration() {
  const tiles = [
    { title: "AI", subtitle: "Beginner" },
    { title: "Data", subtitle: "Analytics" },
    { title: "Design", subtitle: "Studio" },
    { title: "Finance", subtitle: "Markets" },
    { title: "Product", subtitle: "Strategy" },
    { title: "Coding", subtitle: "Practice" },
    { title: "Leadership", subtitle: "Teams" },
    { title: "Marketing", subtitle: "Growth" },
    { title: "Career", subtitle: "Outcomes" },
  ];

  return (
    <div
      className="relative grid h-[min(420px,60vh)] w-[min(420px,60vw)] grid-cols-3 grid-rows-3 gap-3"
      aria-hidden="true"
    >
      {tiles.map((tile, i) => (
        <div
          key={tile.title}
          data-browse-card
          className="flex flex-col justify-between rounded-md border border-[var(--fog)] p-3"
          style={{
            background:
              i % 3 === 0
                ? "rgba(37,99,235,0.45)"
                : i % 3 === 1
                  ? "rgba(224,180,88,0.38)"
                  : "rgba(17,34,64,0.5)",
          }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {tile.subtitle}
          </span>
          <span
            className="display text-xl leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            {tile.title}
          </span>
        </div>
      ))}
    </div>
  );
}

function EnrollIllustration() {
  return (
    <div className="flex w-[min(460px,70vw)] flex-col gap-4" aria-hidden="true">
      <div
        className="flex items-center justify-between text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--text-secondary)" }}
      >
        <span>Enrolling</span>
        <span data-enroll-pct className="text-[var(--gold-bright)]">
          0%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--fog)]">
        <div
          data-enroll-bar
          className="h-full w-full origin-left rounded-full bg-[var(--gold)]"
        />
      </div>
      <div className="mt-6 space-y-2">
        {["Payment confirmed", "Cohort assigned", "Welcome kit delivered"].map(
          (line, i) => (
            <p
              key={line}
              className="flex items-center gap-3 text-sm"
              style={{ opacity: 1 - i * 0.15, color: "var(--text-secondary)" }}
            >
              <span className="inline-block h-1 w-1 rounded-full bg-[var(--gold)]" />
              {line}
            </p>
          )
        )}
      </div>
    </div>
  );
}

function CertificateIllustration() {
  return (
    <div
      className="relative flex h-[min(360px,56vh)] w-[min(520px,72vw)] items-center justify-center"
      aria-hidden="true"
    >
      <div
        data-cert-piece
        className="absolute inset-0 rounded-lg border border-[var(--gold)]/70 bg-[#112240] shadow-2xl"
      />
      <div
        data-cert-piece
        className="absolute left-8 top-8 text-xs uppercase tracking-[0.25em] text-[var(--gold-bright)]"
      >
        Certificate of Completion
      </div>
      <div
        data-cert-piece
        className="display absolute left-8 top-16 text-2xl"
        style={{ color: "var(--text-primary)" }}
      >
        Prime Learning
      </div>
      <div
        data-cert-piece
        className="absolute bottom-10 left-8 right-20 h-px bg-white/20"
      />
      <div
        data-cert-piece
        className="absolute bottom-12 left-8 text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        Issued to learner
      </div>
      <div
        data-cert-stamp
        className="absolute bottom-8 right-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--gold)] text-[10px] uppercase tracking-[0.2em] text-[var(--gold-bright)]"
      >
        <span className="text-center leading-tight">
          Prime
          <br />
          Verified
        </span>
      </div>
    </div>
  );
}

