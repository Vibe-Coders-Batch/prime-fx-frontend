"use client";

import "@/features/prime-landing/PrimeLandingStyles.module.css";

import Image from "next/image";

import { LenisProvider } from "@/features/prime-landing/components/providers/LenisProvider";
import { DebugFlags } from "@/features/prime-landing/components/providers/DebugFlags";
import { GrainOverlay } from "@/features/prime-landing/components/ui/GrainOverlay";
import { ScrollDebug } from "@/features/prime-landing/components/ui/ScrollDebug";
import { BackgroundCanvas } from "@/features/prime-landing/components/ui/BackgroundCanvas";
import { Loader } from "@/features/prime-landing/components/ui/Loader";
import { CustomCursor } from "@/features/prime-landing/components/ui/CustomCursor";
import { TopNav } from "@/features/prime-landing/components/ui/TopNav";
import { HashScrollHandler } from "@/features/prime-landing/components/ui/HashScrollHandler";
import { Footer } from "@/features/prime-landing/components/ui/Footer";

import { Chapter1Gate } from "@/features/prime-landing/components/chapters/Chapter1Gate";
import { Chapter2Manifesto } from "@/features/prime-landing/components/chapters/Chapter2Manifesto";
import { Chapter3Stats } from "@/features/prime-landing/components/chapters/Chapter3Stats";
import { Chapter4Categories } from "@/features/prime-landing/components/chapters/Chapter4Categories";
import { Chapter5Courses } from "@/features/prime-landing/components/chapters/Chapter5Courses";
// import { ChapterAgenticAICohort } from "@/features/prime-landing/components/chapters/ChapterAgenticAICohort";
import { ChapterTrainerLedCourses } from "@/features/prime-landing/components/chapters/ChapterTrainerLedCourses";
import { Chapter6HowItWorks } from "@/features/prime-landing/components/chapters/Chapter6HowItWorks";
// import { ChapterInstructorSpotlight } from "@/features/prime-landing/components/chapters/ChapterInstructorSpotlight";
import { ChapterCoreTeam } from "@/features/prime-landing/components/chapters/ChapterCoreTeam";
import { ChapterTestimonials } from "@/features/prime-landing/components/chapters/ChapterTestimonials";
import { Chapter7Plans } from "@/features/prime-landing/components/chapters/Chapter7Plans";
import { Chapter8Graduation } from "@/features/prime-landing/components/chapters/Chapter8Graduation";

export function PrimeLandingPage() {
  return (
    <div className="primeLanding">
      <BackgroundCanvas />
      <DebugFlags />
      <LenisProvider>
        <HashScrollHandler />
        <TopNav />
        <main id="main" className="relative">
          <Chapter1Gate />
          <Chapter2Manifesto />
          <Chapter3Stats />
          <Chapter4Categories />
          <Chapter5Courses />
          {/* <ChapterAgenticAICohort /> */}
          <ChapterTrainerLedCourses />
          <Chapter6HowItWorks />
          {/* <ChapterInstructorSpotlight /> */}
          <ChapterCoreTeam />
          <ChapterTestimonials />
          <Chapter7Plans />
          <Chapter8Graduation />
        </main>
        <section
          aria-label="Company attribution"
          className="border-t border-[var(--fog)]/60 bg-[var(--ink)] px-6 py-10 lg:px-16"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/brand/miyo.svg"
                alt="MIYO Global"
                width={44}
                height={44}
                className="h-11 w-11 rounded-md object-contain"
                priority={false}
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-tertiary)" }}>
                  An initiative of
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  MIYO Global
                </p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Prime Learning is an initiative supported by MIYO Global — built to deliver outcomes-driven programmes across India, the UAE, and beyond.
            </p>
          </div>
        </section>
        <Footer />
      </LenisProvider>
      <GrainOverlay />
      <CustomCursor />
      <Loader />
      <ScrollDebug />
    </div>
  );
}

