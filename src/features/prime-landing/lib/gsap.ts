"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const EASE = {
  entrance: "expo.out",
  section: "power4.inOut",
  ui: "back.out(1.7)",
  ambient: "sine.inOut",
  out: "power3.out",
} as const;

export { gsap, ScrollTrigger };

