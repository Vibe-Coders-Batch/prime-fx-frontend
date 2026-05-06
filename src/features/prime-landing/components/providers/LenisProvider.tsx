"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/features/prime-landing/lib/gsap";
import { bindLenisToScrollTrigger } from "@/features/prime-landing/lib/scroll";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";

interface Props {
  children: React.ReactNode;
}

export function LenisProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollY = useScrollStore((s) => s.setScrollY);

  useEffect(() => {
    registerGsap();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      setScrollY(scroll);
    });

    const cleanup = bindLenisToScrollTrigger(lenis);
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.clearTimeout(refreshId);
      cleanup();
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [setScrollY]);

  return <>{children}</>;
}

