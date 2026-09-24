"use client";
import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Check } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { DataList } from "@/components/learning/data-list";
import { ProgressMeter } from "@/components/learning/progress-meter";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { useCourseProgress } from "@/features/progress/hooks/use-progress";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default function CourseProgressPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = use(params);
    const { data: course, isLoading: courseLoading } = useCourse({ enabled: true, courseId });
    const { data: progress, isLoading: progressLoading } = useCourseProgress({
        enabled: true,
        courseId,
    });

    const progressPercentage = parseFloat(progress?.progress || "0");
    const totalLessons =
        course?.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0;
    const completedLessons = progress?.lessonProgress?.filter((lp) => lp.completed).length || 0;

    // The first lesson, in curriculum order, that has not been completed yet.
    // Derived entirely from data already on this page.
    const nextLesson = useMemo(() => {
        if (!course?.sections) return null;
        for (const section of course.sections) {
            for (const lesson of section.lessons || []) {
                const done = progress?.lessonProgress?.find(
                    (lp) => lp.lessonId === lesson.lessonId && lp.completed,
                );
                if (!done) return { section, lesson };
            }
        }
        return null;
    }, [course, progress]);

    if (courseLoading || progressLoading) {
        return (
            <LearningSurface>
                <LearningPageHeader title="Loading..." />
                <div className="space-y-4">
                    <Skeleton className="h-28 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </LearningSurface>
        );
    }

    if (!course) {
        return (
            <LearningSurface>
                <LearningPageHeader title="Course not found" />
                <Panel>
                    <EmptyState
                        title="Course not found"
                        description="The course you're looking for doesn't exist."
                        icon={<BookOpen className="h-12 w-12" />}
                    />
                </Panel>
            </LearningSurface>
        );
    }

    return (
        <LearningSurface>
            <Link
                href="/learner/my-courses"
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--ls-ink-quiet)] hover:text-[var(--ls-accent-ink)] hover:underline"
            >
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                My courses
            </Link>

            <LearningPageHeader
                eyebrow="Course progress"
                title={course.title}
                description="Track your progress through this course."
            />

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8">
                {/* Summary rail. First in the reading order on every width, and
                    placed alongside the curriculum from the large breakpoint up. */}
                <aside
                    aria-labelledby="summary-heading"
                    className="mb-6 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:sticky lg:top-6"
                >
                    <Panel className="p-4">
                        <h2 id="summary-heading" className="sr-only">
                            Progress summary
                        </h2>

                        <ProgressMeter
                            label="Course progress"
                            value={progressPercentage}
                            detail={`${completedLessons} of ${totalLessons} lessons completed`}
                        />

                        <DataList
                            className="mt-4 border-t border-[var(--ls-divider)] pt-3"
                            items={[
                                { label: "Time spent", value: formatTime(progress?.timeSpent || 0) },
                                {
                                    label: "Last accessed",
                                    value: progress?.lastAccessed
                                        ? new Date(progress.lastAccessed).toLocaleDateString(
                                              undefined,
                                              { day: "numeric", month: "short", year: "numeric" },
                                          )
                                        : "Never",
                                },
                            ]}
                        />

                        {nextLesson ? (
                            <div className="mt-4 border-t border-[var(--ls-divider)] pt-3">
                                <p className="text-sm text-[var(--ls-ink-quiet)]">Up next</p>
                                <p className="mt-0.5 text-sm font-medium leading-snug text-[var(--ls-ink)]">
                                    {nextLesson.lesson.title}
                                </p>
                                <p className="mt-0.5 truncate text-xs text-[var(--ls-ink-quiet)]">
                                    {nextLesson.section.title}
                                </p>
                            </div>
                        ) : null}

                        <Link
                            href={`/learner/courses/${courseId}/watch`}
                            className="mt-4 block"
                        >
                            <Button className="w-full">
                                {completedLessons === 0
                                    ? "Start course"
                                    : nextLesson
                                      ? "Continue course"
                                      : "Review course"}
                            </Button>
                        </Link>
                    </Panel>
                </aside>

                <section
                    aria-labelledby="curriculum-heading"
                    className="space-y-3 lg:col-start-1 lg:row-start-1"
                >
                    <SectionHeading
                        id="curriculum-heading"
                        title="Course curriculum"
                        description="Your progress through each section"
                    />

                    <Panel className="overflow-hidden">
                        {course.sections && course.sections.length > 0 ? (
                            <ol className="divide-y divide-[var(--ls-divider)]">
                                {course.sections.map((section, sectionIdx) => {
                                    const sectionLessons = section.lessons || [];
                                    const completedInSection = sectionLessons.filter((lesson) =>
                                        progress?.lessonProgress?.find(
                                            (lp) =>
                                                lp.lessonId === lesson.lessonId && lp.completed,
                                        ),
                                    ).length;

                                    return (
                                        <li key={section.sectionId} className="p-4 sm:p-5">
                                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                                <h3 className="text-sm font-semibold text-[var(--ls-ink)]">
                                                    <span className="ls-nums text-[var(--ls-ink-quiet)]">
                                                        {sectionIdx + 1}.
                                                    </span>{" "}
                                                    {section.title}
                                                </h3>
                                                <span className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                                                    {completedInSection}/{sectionLessons.length}{" "}
                                                    completed
                                                </span>
                                            </div>

                                            {sectionLessons.length > 0 ? (
                                                <ol className="mt-3 space-y-0.5">
                                                    {sectionLessons.map((lesson, lessonIdx) => {
                                                        const done = progress?.lessonProgress?.find(
                                                            (lp) =>
                                                                lp.lessonId === lesson.lessonId &&
                                                                lp.completed,
                                                        );
                                                        return (
                                                            <li
                                                                key={lesson.lessonId}
                                                                className="flex items-center gap-3 rounded-md px-2 py-1.5"
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={cn(
                                                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                                                        done
                                                                            ? "border-transparent bg-[var(--ls-ok)] text-[var(--ls-paper)]"
                                                                            : "border-[var(--ls-divider-strong)]",
                                                                    )}
                                                                >
                                                                    {done ? (
                                                                        <Check className="h-2.5 w-2.5" />
                                                                    ) : null}
                                                                </span>
                                                                <span className="ls-nums w-5 shrink-0 text-xs text-[var(--ls-ink-quiet)]">
                                                                    {lessonIdx + 1}
                                                                </span>
                                                                <span className="min-w-0 flex-1 text-sm text-[var(--ls-ink)]">
                                                                    {lesson.title}
                                                                    <span className="sr-only">
                                                                        {done
                                                                            ? " — completed"
                                                                            : " — not completed"}
                                                                    </span>
                                                                </span>
                                                                {lesson.duration ? (
                                                                    <span className="ls-nums shrink-0 text-xs text-[var(--ls-ink-quiet)]">
                                                                        {formatTime(lesson.duration)}
                                                                    </span>
                                                                ) : null}
                                                            </li>
                                                        );
                                                    })}
                                                </ol>
                                            ) : null}
                                        </li>
                                    );
                                })}
                            </ol>
                        ) : (
                            <EmptyState
                                title="No curriculum yet"
                                description="This course has no sections to show."
                                icon={<BookOpen className="h-12 w-12" />}
                            />
                        )}
                    </Panel>
                </section>
            </div>
        </LearningSurface>
    );
}
