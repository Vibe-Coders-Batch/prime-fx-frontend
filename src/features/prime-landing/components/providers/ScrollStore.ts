"use client";

import { create } from "zustand";

export type ChapterKey =
  | "gate"
  | "manifesto"
  | "stats"
  | "categories"
  | "courses"
  | "cohort"
  | "how"
  | "instructors"
  | "testimonials"
  | "plans"
  | "graduation";

export type Theme = "ink" | "paper";

interface ScrollState {
  portalProgress: number;
  scrollY: number;
  chapter: ChapterKey;
  theme: Theme;
  morph: number;

  setPortalProgress: (v: number) => void;
  setScrollY: (v: number) => void;
  setChapter: (c: ChapterKey) => void;
  setMorph: (v: number) => void;
}

const themeByChapter: Record<ChapterKey, Theme> = {
  gate: "ink",
  manifesto: "ink",
  stats: "paper",
  categories: "paper",
  courses: "ink",
  cohort: "ink",
  how: "ink",
  instructors: "ink",
  testimonials: "ink",
  plans: "paper",
  graduation: "ink",
};

export const useScrollStore = create<ScrollState>((set) => ({
  portalProgress: 0,
  scrollY: 0,
  chapter: "gate",
  theme: "ink",
  morph: 0,
  setPortalProgress: (v) => set({ portalProgress: v }),
  setScrollY: (v) => set({ scrollY: v }),
  setChapter: (c) => set({ chapter: c, theme: themeByChapter[c] }),
  setMorph: (v) => set({ morph: v }),
}));

