"use client";

import "@/features/prime-landing/PrimeLandingStyles.module.css";

import { LenisProvider } from "@/features/prime-landing/components/providers/LenisProvider";
import { DebugFlags } from "@/features/prime-landing/components/providers/DebugFlags";
import { GrainOverlay } from "@/features/prime-landing/components/ui/GrainOverlay";
import { ScrollDebug } from "@/features/prime-landing/components/ui/ScrollDebug";
import { BackgroundCanvas } from "@/features/prime-landing/components/ui/BackgroundCanvas";
import { Loader } from "@/features/prime-landing/components/ui/Loader";
import { CustomCursor } from "@/features/prime-landing/components/ui/CustomCursor";
import { TopNav } from "@/features/prime-landing/components/ui/TopNav";
import { Footer } from "@/features/prime-landing/components/ui/Footer";

import { Chapter1Gate } from "@/features/prime-landing/components/chapters/Chapter1Gate";
import { Chapter2Manifesto } from "@/features/prime-landing/components/chapters/Chapter2Manifesto";
import { Chapter3Stats } from "@/features/prime-landing/components/chapters/Chapter3Stats";
import { Chapter4Categories } from "@/features/prime-landing/components/chapters/Chapter4Categories";
import { Chapter5Courses } from "@/features/prime-landing/components/chapters/Chapter5Courses";
import { ChapterAgenticAICohort } from "@/features/prime-landing/components/chapters/ChapterAgenticAICohort";
import { Chapter6HowItWorks } from "@/features/prime-landing/components/chapters/Chapter6HowItWorks";
import { ChapterInstructorSpotlight } from "@/features/prime-landing/components/chapters/ChapterInstructorSpotlight";
import { ChapterTestimonials } from "@/features/prime-landing/components/chapters/ChapterTestimonials";
import { Chapter7Plans } from "@/features/prime-landing/components/chapters/Chapter7Plans";
import { Chapter8Graduation } from "@/features/prime-landing/components/chapters/Chapter8Graduation";

export function PrimeLandingPage() {
  return (
    <div className="primeLanding">
      <BackgroundCanvas />
      <DebugFlags />
      <LenisProvider>
        <TopNav />
        <main id="main" className="relative">
          <Chapter1Gate />
          <Chapter2Manifesto />
          <Chapter3Stats />
          <Chapter4Categories />
          <Chapter5Courses />
          <ChapterAgenticAICohort />
          <Chapter6HowItWorks />
          <ChapterInstructorSpotlight />
          <ChapterTestimonials />
          <Chapter7Plans />
          <Chapter8Graduation />
        </main>
        <Footer />
      </LenisProvider>
      <GrainOverlay />
      <CustomCursor />
      <Loader />
      <ScrollDebug />
    </div>
  );
}

