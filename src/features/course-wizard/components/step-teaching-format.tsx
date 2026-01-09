"use client";

import { useCourseWizard } from "../store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Video, FileText, CheckSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";

import { AnimatedRadioCard } from "@/components/ui/animated-radio-card";

export function StepTeachingFormat() {
  const { nextStep, prevStep, currentStep } = useCourseWizard();
  useEffect(() => {  }, [currentStep]);
  const [formats, setFormats] = useState<{
    video: boolean;
    text: boolean;
    quiz: boolean;
  }>({
    video: true,
    text: false,
    quiz: false,
  });

  const handleToggle = (key: keyof typeof formats) => {
    setFormats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onNext = () => {
    if (!formats.video && !formats.text && !formats.quiz) {
        toast.error("Please select at least one teaching format.");
        return;
    }
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-10">
         <h2 className="text-3xl font-bold tracking-tight">Teaching Format</h2>
         <p className="text-muted-foreground text-lg">Pick the content types you'll include in this course.</p>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-3">
                <AnimatedRadioCard
                    selected={formats.video ?? false}
                    onClick={() => handleToggle('video')}
                    title="Video Lessons"
                    description="Pre-recorded video lectures for students to watch at their own pace."
                    icon={<Video className="h-8 w-8" />}
                    className="h-full"
                />

                <AnimatedRadioCard
                    selected={formats.text ?? false}
                    onClick={() => handleToggle('text')}
                    title="Text / Articles"
                    description="Written content, guides, and documentation for detailed learning."
                    icon={<FileText className="h-8 w-8" />}
                    className="h-full"
                />

                <AnimatedRadioCard
                    selected={formats.quiz ?? false}
                    onClick={() => handleToggle('quiz')}
                    title="Quizzes"
                    description="Assessments to test student knowledge and retention."
                    icon={<CheckSquare className="h-8 w-8" />}
                    className="h-full"
                />
            </div>

            <div className="flex justify-between pt-12">
              <Button variant="ghost" onClick={prevStep} size="lg" className="px-6 text-muted-foreground hover:text-foreground">
                Back
              </Button>
              <Button onClick={onNext} size="lg" className="px-8 rounded-full">
                Continue
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
