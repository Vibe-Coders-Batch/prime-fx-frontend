"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, registerGsap } from "@/features/prime-landing/lib/gsap";

export function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    registerGsap();
    const overlay = overlayRef.current;
    const bar = barRef.current;
    if (!overlay || !bar) return;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      overlay.style.display = "none";
      window.dispatchEvent(new Event("pl:loader-complete"));
      setDone(true);
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let completed = false;

    const complete = () => {
      if (completed) return;
      completed = true;
      tl = gsap.timeline();
      tl.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          overlay.style.display = "none";
          setDone(true);
          window.dispatchEvent(new Event("pl:loader-complete"));
        },
      });
    };

    gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
    gsap.to(bar, {
      scaleX: 1,
      duration: 1.2,
      ease: "expo.out",
      onComplete: () => {
        // Small hold so it feels intentional, then fade out.
        window.setTimeout(complete, 250);
      },
    });

    return () => {
      tl?.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--ink)]"
    >
      <div className="flex w-[min(560px,92vw)] flex-col items-center gap-6">
        <Image
          src="/logo-dark.svg"
          alt=""
          width={520}
          height={200}
          className="h-auto w-full max-w-[min(280px,80vw)] object-contain"
          priority
        />
        <div className="h-px w-full bg-white/10">
          <div ref={barRef} className="h-px w-full bg-[var(--gold)]" />
        </div>
      </div>
    </div>
  );
}

