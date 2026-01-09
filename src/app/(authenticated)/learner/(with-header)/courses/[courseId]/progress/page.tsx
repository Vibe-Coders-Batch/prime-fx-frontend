"use client";

import { use } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { useCourseProgress } from "@/features/progress/hooks/use-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";

export default function CourseProgressPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);

  const { data: course, isLoading: courseLoading } = useCourse({
    enabled: true,
    courseId,
  });
  const { data: progress, isLoading: progressLoading } = useCourseProgress({
    enabled: true,
    courseId,
  });
  const { user } = useAuthStore();
  const router = useRouter();

  const progressPercentage = parseFloat(progress?.progress || "0");
  const totalLessons =
    course?.sections?.reduce(
      (acc, section) => acc + (section.lessons?.length || 0),
      0
    ) || 0;
  const completedLessons =
    progress?.lessonProgress?.filter((lp) => lp.completed).length || 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (courseLoading || progressLoading) {
    return (
      <PageLayout header="Loading...">
        <Skeleton className="h-64 w-full" />
      </PageLayout>
    );
  }

  if (!course) {
    return (
      <PageLayout header="Course Not Found">
        <EmptyState
          title="Course not found"
          description="The course you're looking for doesn't exist."
          icon={<BookOpen className="h-12 w-12" />}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={`Course Progress: ${course.title}`}
      subtitle="Learning"
      description="Track your progress through this course."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              {completedLessons} of {totalLessons} lessons completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span className="font-semibold">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-lg font-semibold">
                  {formatTime(progress?.timeSpent || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Accessed</p>
                <p className="text-lg font-semibold">
                  {progress?.lastAccessed
                    ? new Date(progress.lastAccessed).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Curriculum</CardTitle>
            <CardDescription>
              Your progress through each section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {course.sections?.map((section, sectionIdx) => {
                const sectionLessons = section.lessons || [];
                const completedInSection = sectionLessons.filter((lesson) =>
                  progress?.lessonProgress?.find(
                    (lp) => lp.lessonId === lesson.lessonId && lp.completed
                  )
                ).length;
                const sectionProgress =
                  sectionLessons.length > 0
                    ? (completedInSection / sectionLessons.length) * 100
                    : 0;

                return (
                  <div key={section.sectionId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        Section {sectionIdx + 1}: {section.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {completedInSection}/{sectionLessons.length} completed
                      </span>
                    </div>
                    <Progress value={sectionProgress} className="h-1" />
                    <div className="space-y-2 ml-4">
                      {sectionLessons.map((lesson, lessonIdx) => {
                        const lessonProgress = progress?.lessonProgress?.find(
                          (lp) => lp.lessonId === lesson.lessonId
                        );
                        return (
                          <div
                            key={lesson.lessonId}
                            className="flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors"
                          >
                            {lessonProgress?.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                            ) : (
                              <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                            )}
                            <span className="flex-1 text-sm">
                              {lessonIdx + 1}. {lesson.title}
                            </span>
                            {lesson.duration && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(lesson.duration)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
