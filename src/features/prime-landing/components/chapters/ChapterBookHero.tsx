"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ScrollTrigger, registerGsap } from "@/features/prime-landing/lib/gsap";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { FallbackBookHero } from "@/features/prime-landing/components/book/FallbackBookHero";

const BookScene = dynamic(
  () => import("@/features/prime-landing/components/book/BookScene").then((m) => m.BookScene),
  { ssr: false, loading: () => <FallbackBookHero /> }
);

// ─── Design tokens ─────────────────────────────────────────────────────────────
const GOLD      = "#C8982A";
const GOLDA     = "rgba(200,152,42,0.22)";
const INK       = "#0B192F";
const GLASS_BG  = "rgba(8,18,36,0.80)";
const GLASS_BD  = "rgba(200,152,42,0.20)";
const PAPER_BG  = "rgba(248,244,234,0.97)";
const PAPER_BD  = "rgba(192,144,48,0.24)";
const PAPER_INK = "#0c1f38";
const PAPER_SUB = "#3d4f62";
const DIM_TEXT  = "#b8c8d8";

// ─── Stage config ──────────────────────────────────────────────────────────────
type PanelType = "beside-right" | "beside-left" | "inside";
const STAGES: { pIn: number; pOut: number; type: PanelType }[] = [
  { pIn: -0.01, pOut: 0.14, type: "beside-right" }, // 0 cover closed: headline
  { pIn: 0.16,  pOut: 0.36, type: "beside-left"  }, // 1 cover lifting: intro
  { pIn: 0.37,  pOut: 0.52, type: "inside"       }, // 2 page 1: programmes
  { pIn: 0.53,  pOut: 0.67, type: "beside-right" }, // 3 page 2: journey
  { pIn: 0.68,  pOut: 0.81, type: "inside"       }, // 4 page 3: stats
  { pIn: 0.84,  pOut: 1.01, type: "beside-right" }, // 5 fully open: CTA
];
const FADE = 0.038;
const SL   = 22;

// ─── Panel look ────────────────────────────────────────────────────────────────
const glassBox: React.CSSProperties = {
  borderRadius: 16,
  border: `1px solid ${GLASS_BD}`,
  background: GLASS_BG,
  backdropFilter: "blur(18px) saturate(140%)",
  WebkitBackdropFilter: "blur(18px) saturate(140%)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.04)",
  padding: "28px 26px",
};
const paperBox: React.CSSProperties = {
  borderRadius: 12,
  border: `1px solid ${PAPER_BD}`,
  background: PAPER_BG,
  boxShadow: "0 16px 48px rgba(0,0,0,0.46), 0 2px 8px rgba(0,0,0,0.20)",
  overflow: "hidden",
};

function GoldRule() {
  return <div style={{ height: 1, margin: "14px 0", background: `linear-gradient(to right,transparent,${GOLD},transparent)`, opacity: 0.38 }} />;
}

function ChapterTab({ label }: { label: string }) {
  return (
    <div style={{
      width: 36, flexShrink: 0,
      background: `linear-gradient(to bottom,${GOLDA},rgba(200,152,42,0.04))`,
      borderRight: `1px solid ${PAPER_BD}`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 8, padding: "20px 0",
    }}>
      <div style={{ width: 1, height: 24, background: `linear-gradient(${GOLD},transparent)`, opacity: 0.5 }} />
      <p style={{ writingMode: "vertical-rl", fontSize: 9, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase", opacity: 0.7, margin: 0 }}>{label}</p>
      <div style={{ width: 5, height: 5, background: GOLD, transform: "rotate(45deg)", opacity: 0.5 }} />
    </div>
  );
}

// ─── Stage 0: brand hero beside-right ─────────────────────────────────────────
function S0() {
  return (
    <div style={{ ...glassBox, width: 310 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Image src="/logo-dark.svg" alt="Prime Learning" width={126} height={34} priority style={{ objectFit: "contain" }} />
        <div style={{ width: 1, height: 26, background: GLASS_BD }} />
        <Image src="/brand/miyo.svg" alt="MIYO" width={20} height={20} style={{ opacity: 0.55 }} />
      </div>
      <GoldRule />
      <h1 style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "clamp(1.5rem,2.8vw,2.1rem)", color: "#f4efe6", lineHeight: 1.18, margin: "0 0 12px" }}>
        Open a New <em style={{ fontStyle: "normal", color: GOLD }}>Chapter</em>
      </h1>
      <p style={{ fontSize: 13, color: DIM_TEXT, lineHeight: 1.68, margin: "0 0 20px" }}>
        Premium, outcomes-driven programmes for senior professionals across India and the Gulf.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["India", "UAE", "43 Countries"].map((t) => (
          <span key={t} style={{ fontSize: 10, color: GOLD, border: `1px solid ${GOLDA}`, borderRadius: 20, padding: "3px 10px", letterSpacing: "0.12em" }}>{t}</span>
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, opacity: 0.3 }}>
        <span style={{ fontSize: 9, color: DIM_TEXT, letterSpacing: "0.18em", textTransform: "uppercase" }}>Scroll to open</span>
        <div style={{ width: 20, height: 1, background: GOLD }} />
      </div>
    </div>
  );
}

// ─── Stage 1: intro beside-left ───────────────────────────────────────────────
function S1() {
  return (
    <div style={{ ...glassBox, width: 295 }}>
      <p style={{ fontSize: 10, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 12px" }}>Professional Learning</p>
      <h2 style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "clamp(1.25rem,2.5vw,1.8rem)", color: "#f4efe6", lineHeight: 1.22, margin: "0 0 14px" }}>
        Where Ambition<br />Meets Craft
      </h2>
      <GoldRule />
      <p style={{ fontSize: 13, color: DIM_TEXT, lineHeight: 1.68, margin: 0 }}>
        Every programme at Prime Learning is designed with one outcome: your next career milestone. Expert-led, GCC-relevant, and outcomes-driven.
      </p>
    </div>
  );
}

// ─── Stage 2: programmes inside page ─────────────────────────────────────────
function S2() {
  const items = [
    { l: "Leadership and Strategy",  d: "C-suite readiness and boardroom impact" },
    { l: "Digital Transformation",   d: "AI, data, and technology leadership" },
    { l: "Finance and Compliance",   d: "Regulatory excellence for GCC markets" },
    { l: "Professional Excellence",  d: "Communication, negotiation, executive presence" },
  ];
  return (
    <div style={{ ...paperBox, width: 380 }}>
      <div style={{ display: "flex" }}>
        <ChapterTab label="Chapter I" />
        <div style={{ padding: "20px 18px", flex: 1 }}>
          <p style={{ fontSize: 9, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 4px" }}>Curated Programmes</p>
          <h2 style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "1.3rem", color: PAPER_INK, lineHeight: 1.2, margin: "0 0 10px" }}>What We Teach</h2>
          <div style={{ height: 1, background: `linear-gradient(to right,${GOLD}55,transparent)`, marginBottom: 13 }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
            {items.map((it) => (
              <li key={it.l} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ color: GOLD, fontSize: 7, marginTop: 5, flexShrink: 0 }}>◆</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: PAPER_INK, margin: 0 }}>{it.l}</p>
                  <p style={{ fontSize: 11, color: PAPER_SUB, margin: "2px 0 0" }}>{it.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Stage 3: journey beside-right ───────────────────────────────────────────
function S3() {
  const steps = [
    { n: "01", l: "Enrol",   d: "Choose your programme in minutes" },
    { n: "02", l: "Learn",   d: "Expert-led live and async sessions" },
    { n: "03", l: "Apply",   d: "Real-world projects and case studies" },
    { n: "04", l: "Certify", d: "Industry-recognised credential" },
  ];
  return (
    <div style={{ ...glassBox, width: 295 }}>
      <p style={{ fontSize: 10, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 8px" }}>Chapter II</p>
      <h2 style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "clamp(1.25rem,2.5vw,1.8rem)", color: "#f4efe6", lineHeight: 1.2, margin: "0 0 14px" }}>The Journey</h2>
      <GoldRule />
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map((s) => (
          <li key={s.n} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "Georgia,serif", fontSize: "1.1rem", color: GOLD, opacity: 0.55, lineHeight: 1, minWidth: 24 }}>{s.n}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#eee8da", margin: 0 }}>{s.l}</p>
              <p style={{ fontSize: 11, color: DIM_TEXT, margin: "3px 0 0" }}>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Stage 4: stats inside page ──────────────────────────────────────────────
function S4() {
  const stats = [
    { n: "4,000+", l: "Learners" },
    { n: "98%",    l: "Completion Rate" },
    { n: "12",     l: "GCC Partners" },
    { n: "43",     l: "Countries" },
  ];
  return (
    <div style={{ ...paperBox, width: 380 }}>
      <div style={{ display: "flex" }}>
        <ChapterTab label="Chapter III" />
        <div style={{ padding: "20px 18px", flex: 1 }}>
          <p style={{ fontSize: 9, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 4px" }}>Results That Speak</p>
          <h2 style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "1.3rem", color: PAPER_INK, lineHeight: 1.2, margin: "0 0 10px" }}>By the Numbers</h2>
          <div style={{ height: 1, background: `linear-gradient(to right,${GOLD}55,transparent)`, marginBottom: 13 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {stats.map((s) => (
              <div key={s.n} style={{ borderRadius: 8, border: "1px solid rgba(192,144,48,0.20)", background: "rgba(200,152,42,0.06)", padding: "11px 13px" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "1.65rem", color: GOLD, lineHeight: 1, margin: 0 }}>{s.n}</p>
                <p style={{ fontSize: 10, color: PAPER_SUB, margin: "4px 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stage 5: CTA beside-right ────────────────────────────────────────────────
function S5() {
  const handleExplore = () => {
    const el = document.querySelector("#chapter-courses") as HTMLElement | null;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (v: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top); else window.scrollTo({ top, behavior: "smooth" });
  };
  return (
    <div style={{ ...glassBox, width: 295 }}>
      <p style={{ fontSize: 10, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 8px" }}>Begin</p>
      <h2 style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "clamp(1.25rem,2.5vw,1.8rem)", color: "#f4efe6", lineHeight: 1.2, margin: "0 0 14px" }}>
        Your Story<br />Begins Here
      </h2>
      <GoldRule />
      <p style={{ fontSize: 13, color: DIM_TEXT, lineHeight: 1.68, margin: "0 0 20px" }}>
        Join 4,000 professionals who chose Prime Learning to lead with purpose.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={handleExplore}
          style={{ display: "block", width: "100%", padding: "13px 20px", borderRadius: 40, background: GOLD, color: INK, fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}
        >Explore Programmes</button>
        <button
          style={{ display: "block", width: "100%", padding: "12px 20px", borderRadius: 40, background: "transparent", color: "#c8d8e8", fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.14)", cursor: "pointer" }}
        >Request a Brochure</button>
      </div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8, opacity: 0.32 }}>
        <Image src="/brand/miyo.svg" alt="MIYO Global" width={16} height={16} />
        <span style={{ fontSize: 10, color: DIM_TEXT }}>An initiative of MIYO Global</span>
      </div>
    </div>
  );
}

const PANELS = [<S0 key={0} />, <S1 key={1} />, <S2 key={2} />, <S3 key={3} />, <S4 key={4} />, <S5 key={5} />];

// ─── Positioning ───────────────────────────────────────────────────────────────
function computeTransform(type: PanelType, ty: number): string {
  if (type === "beside-right") return `translateY(calc(-50% + ${ty}px))`;
  if (type === "beside-left")  return `translateY(calc(-50% + ${ty}px))`;
  return `translate(-44%, calc(-50% + ${ty}px))`;
}

function panelInit(type: PanelType, active: boolean): React.CSSProperties {
  const ty = active ? 0 : SL;
  const shared: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    zIndex: 20,
    opacity: active ? 1 : 0,
    pointerEvents: active ? "auto" : "none",
    willChange: "opacity, transform",
    transition: "opacity 0.14s linear, transform 0.14s linear",
  };
  if (type === "beside-right") return { ...shared, right: "3.5%",  transform: computeTransform(type, ty) };
  if (type === "beside-left")  return { ...shared, left:  "3.5%",  transform: computeTransform(type, ty) };
  return { ...shared, left: "50%", transform: computeTransform(type, ty) };
}

// ─── WebGL check ───────────────────────────────────────────────────────────────
function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    return !!gl
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      && (navigator.hardwareConcurrency ?? 4) >= 4
      && new URL(window.location.href).searchParams.get("nowebgl") !== "1";
  } catch { return false; }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ChapterBookHero() {
  const rootRef   = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const canRender = useRef<boolean | null>(null);

  const setBookProgress = useScrollStore((s) => s.setBookProgress);
  const setChapter      = useScrollStore((s) => s.setChapter);

  if (canRender.current === null && typeof window !== "undefined") {
    canRender.current = detectWebGL();
  }

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;
    const kills: Array<{ kill: () => void }> = [];

    kills.push(ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: ({ progress: p }) => {
        setBookProgress(p);

        panelRefs.current.forEach((el, i) => {
          if (!el) return;
          const { pIn, pOut, type } = STAGES[i];
          const inStart = pIn  - FADE * 0.4;
          const outEnd  = pOut + FADE * 0.4;

          if (p < inStart || p > outEnd) {
            el.style.opacity       = "0";
            el.style.pointerEvents = "none";
            el.style.transform     = computeTransform(type, p < inStart ? SL : -SL);
            return;
          }

          const fadeIn  = Math.min(1, (p - inStart) / FADE);
          const fadeOut = Math.min(1, (outEnd - p)  / FADE);
          const opacity = Math.min(fadeIn, fadeOut);
          const ty = SL * (1 - fadeIn) - SL * (1 - fadeOut);

          el.style.opacity       = String(opacity);
          el.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
          el.style.transform     = computeTransform(type, ty);
        });

        const active = STAGES.findIndex(({ pIn, pOut }) => p >= pIn && p <= pOut);
        dotRefs.current.forEach((d, i) => {
          if (!d) return;
          d.style.opacity   = i === active ? "1"        : "0.22";
          d.style.transform = i === active ? "scale(1.5)" : "scale(1)";
        });
      },
    }));

    kills.push(ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end:   "bottom center",
      onEnter:     () => setChapter("gate"),
      onEnterBack: () => setChapter("gate"),
    }));

    return () => kills.forEach((k) => k.kill());
  }, [setBookProgress, setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-gate"
      style={{ height: "700vh", backgroundColor: INK, position: "relative" }}
      aria-label="Prime Learning book experience"
    >
      <div style={{
        position: "sticky", top: 0,
        height: "100vh", width: "100%",
        overflow: "hidden", isolation: "isolate",
      }}>
        {/* WebGL scene */}
        {canRender.current !== false ? <BookScene /> : <FallbackBookHero />}

        {/* Vignette */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse 76% 80% at 50% 50%, transparent 30%, rgba(11,25,47,0.55) 100%)",
        }} />

        {/* Panels */}
        {STAGES.map((stage, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el; }}
            style={panelInit(stage.type, i === 0)}
          >
            {PANELS[i]}
          </div>
        ))}

        {/* Progress dots */}
        <div style={{
          position: "absolute", bottom: 24, left: "50%",
          transform: "translateX(-50%)", zIndex: 30,
          display: "flex", gap: 8, alignItems: "center",
          pointerEvents: "none",
        }}>
          {STAGES.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#E0B458",
                opacity: i === 0 ? 1 : 0.22,
                transform: i === 0 ? "scale(1.5)" : "scale(1)",
                transition: "opacity 0.28s ease, transform 0.28s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
