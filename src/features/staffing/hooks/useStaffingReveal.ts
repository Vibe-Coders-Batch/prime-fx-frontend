"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/features/prime-landing/lib/gsap";

export function useStaffingReveal(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const blocks = root.querySelectorAll<HTMLElement>("[data-reveal]");
      gsap.set(blocks, { y: 18, opacity: 0 });

      ScrollTrigger.batch(blocks, {
        start: "top 88%",
        onEnter: (els) =>
          gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: "expo.out",
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
