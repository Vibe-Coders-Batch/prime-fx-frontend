"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, FileEdit, PlusCircle, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { MetricTile } from "@/components/learning/metric-tile";
import { StatusPill, type StatusTone } from "@/components/learning/status-pill";
import { sentenceCaseEnum } from "@/components/learning/format";
import { useInstructorStats } from "@/lib/hooks/use-instructor";
import { useDeleteCourse } from "@/features/courses/hooks/use-courses";

function courseStatusTone(status: string): StatusTone {
    if (status === "PUBLISHED") return "ok";
    if (status === "DRAFT") return "warn";
    return "neutral";
}

export default function InstructorDashboardPage() {
    const { data: stats, isLoading } = useInstructorStats();
    const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
    const deleteCourse = useDeleteCourse();

    const handleDeleteCourse = async (courseId: string) => {
        try {
            setDeletingCourseId(courseId);
            await deleteCourse.mutateAsync(courseId);
        } finally {
            setDeletingCourseId(null);
        }
    };

    if (isLoading) {
        return (
            <LearningSurface width="wide">
                <LearningPageHeader title="Dashboard" />
                <div className="grid gap-3 md:grid-cols-3">
                    <Skeleton className="h-28 rounded-lg" />
                    <Skeleton className="h-28 rounded-lg" />
                    <Skeleton className="h-28 rounded-lg" />
                </div>
            </LearningSurface>
        );
    }

    return (
        <LearningSurface width="wide">
            <LearningPageHeader eyebrow="Instructor" title="Dashboard" />

            <div className="space-y-6">
                <section aria-labelledby="totals-heading" className="space-y-3">
                    <SectionHeading id="totals-heading" title="Your totals" />
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        <MetricTile
                            label="Total students"
                            value={(stats?.totalStudents || 0).toLocaleString()}
                            hint="Across all courses"
                        />
                        <MetricTile
                            label="Total courses"
                            value={(stats?.totalCourses || 0).toLocaleString()}
                            hint="Created courses"
                        />
                        <MetricTile
                            label="Total revenue"
                            value={`AED ${(stats?.totalRevenue || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}`}
                            hint="Lifetime earnings"
                        />
                    </div>
                </section>

                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">
                    <aside
                        aria-label="Quick actions"
                        className="mb-6 lg:col-start-2 lg:row-start-1 lg:mb-0"
                    >
                        <Panel className="p-5">
                            <h2 className="text-base font-semibold text-[var(--ls-ink)]">
                                Quick actions
                            </h2>
                            <div className="mt-3 grid gap-2">
                                <Button className="w-full justify-start text-sm" asChild>
                                    <Link href="/instructor/courses/new">
                                        <PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />
                                        Create New Course
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-sm"
                                    asChild
                                >
                                    <Link href="/instructor/courses">
                                        <BookOpen aria-hidden="true" className="mr-2 h-4 w-4" />
                                        Manage Courses
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-sm"
                                    asChild
                                >
                                    <Link href="/instructor/videos">
                                        <Video aria-hidden="true" className="mr-2 h-4 w-4" />
                                        View All Videos
                                    </Link>
                                </Button>
                            </div>
                        </Panel>
                    </aside>

                    <section
                        aria-labelledby="recent-heading"
                        className="space-y-3 lg:col-start-1 lg:row-start-1"
                    >
                        <SectionHeading
                            id="recent-heading"
                            title="Recent courses"
                            actions={
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/instructor/courses">View All</Link>
                                </Button>
                            }
                        />
                        <Panel className="overflow-hidden">
                            {stats?.recentCourses && stats.recentCourses.length > 0 ? (
                                <ul className="divide-y divide-[var(--ls-divider)]">
                                    {stats.recentCourses.map((course: any) => (
                                        <li
                                            key={course.courseId}
                                            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <p className="truncate text-sm font-medium text-[var(--ls-ink)]">
                                                    {course.title}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--ls-ink-quiet)]">
                                                    <StatusPill
                                                        tone={courseStatusTone(course.status)}
                                                    >
                                                        {sentenceCaseEnum(String(course.status))}
                                                    </StatusPill>
                                                    <span className="ls-nums">
                                                        {course.enrollmentCount || 0} students
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link
                                                        href={`/instructor/courses/${course.courseId}/edit`}
                                                    >
                                                        <FileEdit
                                                            aria-hidden="true"
                                                            className="h-3 w-3 sm:mr-2"
                                                        />
                                                        <span className="hidden sm:inline">
                                                            Edit
                                                        </span>
                                                        <span className="sr-only">
                                                            {" "}
                                                            {course.title}
                                                        </span>
                                                    </Link>
                                                </Button>
                                                {course.status === "DRAFT" ? (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={
                                                                    deletingCourseId ===
                                                                    course.courseId
                                                                }
                                                            >
                                                                <Trash2
                                                                    aria-hidden="true"
                                                                    className="h-4 w-4"
                                                                />
                                                                <span className="sr-only">
                                                                    Delete {course.title}
                                                                </span>
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete Course?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete
                                                                    &quot;{course.title}&quot;? This
                                                                    action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDeleteCourse(
                                                                            course.courseId,
                                                                        )
                                                                    }
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <BookOpen
                                        aria-hidden="true"
                                        className="mb-2 h-8 w-8 text-[var(--ls-ink-quiet)]"
                                    />
                                    <p className="text-sm text-[var(--ls-ink-quiet)]">
                                        No courses created yet.
                                    </p>
                                    <Button variant="link" asChild className="mt-2">
                                        <Link href="/instructor/courses/new">
                                            Create your first course
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </Panel>
                    </section>
                </div>
            </div>
        </LearningSurface>
    );
}
