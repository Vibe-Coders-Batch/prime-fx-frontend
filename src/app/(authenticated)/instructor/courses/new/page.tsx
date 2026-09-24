"use client";
import { Suspense } from "react";
import { PageTransition } from "@/components/page-transition";
import { useCourseWizard } from "@/features/course-wizard/store";
import { StepBasics } from "@/features/course-wizard/components/step-basics";
import { StepTeachingFormat } from "@/features/course-wizard/components/step-teaching-format";
import { StepAudience } from "@/features/course-wizard/components/step-audience";
import { StepCurriculum } from "@/features/course-wizard/components/step-curriculum";
import { StepContent } from "@/features/course-wizard/components/step-content";
import { StepSettings } from "@/features/course-wizard/components/step-settings";
import { StepPricing } from "@/features/course-wizard/components/step-pricing";
import { StepReview } from "@/features/course-wizard/components/step-review";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
export default function CourseCreationPage() {
    return (<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}><CourseCreationContent /></Suspense>);
}
function CourseCreationContent() {
    const { currentStep, totalSteps, courseTitle } = useCourseWizard();
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepBasics />;
            case 2:
                return <StepTeachingFormat />;
            case 3:
                return <StepAudience />;
            case 4:
                return <StepCurriculum />;
            case 5:
                return <StepPricing />;
            case 6:
                return <StepContent />;
            case 7:
                return <StepSettings />;
            case 8:
                return <StepReview />;
            default:
                return <StepBasics />;
        }
    };
    const steps = [
        { title: "Basics" },
        { title: "Format" },
        { title: "Audience" },
        { title: "Curriculum" },
        { title: "Pricing" },
        { title: "Content" },
        { title: "Settings" },
        { title: "Review" },
    ];
    return (<PageTransition>
      <div className="learning-surface min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[var(--ls-canvas)] p-4 md:p-8 max-w-[1600px] mx-auto text-[var(--ls-ink)]">
        
        <div className="hidden lg:block lg:col-span-3 xl:col-span-2 relative">
           <div className="sticky top-8 space-y-8">
              <div>
                <BackButton href="/instructor/courses" className="mb-4"/>
                <h1 className="text-2xl font-semibold tracking-tight mb-2 text-[var(--ls-ink)]">Create course</h1>
                <p className="text-sm text-[var(--ls-ink-quiet)]">
                   {courseTitle || "Untitled Course"}
                </p>
              </div>
              
              <ol className="relative border-l-2 border-[var(--ls-divider)] pl-4 space-y-6">
                 {steps.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            return (<li key={index} className="relative group">
                           
                           {(isActive || isCompleted) && (<motion.div layoutId="activeStepLine" className={cn("absolute -left-[18px] top-0 h-full w-[2px]", isCompleted ? "bg-[var(--ls-accent)]" : "bg-[var(--ls-accent)]")} transition={{ duration: 0.3 }}/>)}
                           
                           <div className={cn("flex items-center gap-3 text-sm transition-colors duration-200", isActive ? "text-[var(--ls-accent-ink)] font-semibold" :
                    isCompleted ? "text-[var(--ls-ink)]" : "text-[var(--ls-ink-quiet)]")}>
                               <span className={cn("flex items-center justify-center w-6 h-6 rounded-full border text-[10px] bg-[var(--ls-paper)]", isActive ? "border-[var(--ls-accent)] text-[var(--ls-accent-ink)]" :
                    isCompleted ? "border-[var(--ls-accent)] bg-[var(--ls-accent)] text-white" : "border-[var(--ls-divider-strong)]")}>
                                   {isCompleted ? "✓" : stepNum}
                               </span>
                               {step.title}
                           </div>
                        </li>);
        })}
              </ol>
           </div>
        </div>

        
        <div className="lg:col-span-9 xl:col-span-10 flex flex-col">
            <div className="lg:hidden mb-6">
                <div className="flex justify-between items-center mb-4">
                  <BackButton href="/instructor/courses"/>
                  <span className="ls-nums text-sm font-medium text-[var(--ls-ink-quiet)]">Step {currentStep} of {totalSteps}</span>
                </div>
                
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }} className="w-full max-w-4xl mx-auto">
                {renderStep()}
              </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </PageTransition>);
}
