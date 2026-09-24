"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SecureImage } from "@/components/ui/secure-image";
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
} from "@/components/learning/learning-surface";
import { StatusPill, type StatusTone } from "@/components/learning/status-pill";
import { useCourses, useDeleteCourse } from "@/features/courses/hooks/use-courses";
import { useAuthStore } from "@/lib/store/auth-store";

/** Same precedence the page has always used: review state outranks status. */
function submissionState(course: {
    status: string;
    reviewStatus?: string | null;
}): { label: string; tone: StatusTone } {
    switch (course.reviewStatus) {
        case "APPROVED":
            return { label: "Published", tone: "ok" };
        case "PENDING_REVIEW":
            return { label: "Under review", tone: "accent" };
        case "CHANGES_REQUESTED":
            return { label: "Changes requested", tone: "warn" };
        case "REJECTED":
            return { label: "Rejected", tone: "risk" };
        default:
            return { label: "Draft", tone: "neutral" };
    }
}

export default function InstructorCourseManagementPage() {
    const { user } = useAuthStore();
    const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
    const deleteCourse = useDeleteCourse();
    const { data: coursesData, isLoading } = useCourses({
        enabled: !!user?.id,
        filters: { instructorId: user?.id, limit: 100 },
    });

    const handleDeleteCourse = async (courseId: string) => {
        try {
            setDeletingCourseId(courseId);
            await deleteCourse.mutateAsync(courseId);
        } finally {
            setDeletingCourseId(null);
        }
    };

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                eyebrow="Course management"
                title="My courses"
                description="Manage and edit your courses."
                actions={
                    <Link href="/instructor/courses/new">
                        <Button className="w-full sm:w-auto">
                            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">New Course</span>
                            <span className="sm:hidden">New</span>
                        </Button>
                    </Link>
                }
            />

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-72 rounded-lg" />
                    ))}
                </div>
            ) : !coursesData?.data || coursesData.data.length === 0 ? (
                <Panel>
                    <EmptyState
                        title="No courses yet"
                        description="Create your first course to start teaching."
                        icon={<BookOpen className="h-12 w-12" />}
                        action={{
                            label: "Create Course",
                            onClick: () => (window.location.href = "/instructor/courses/new"),
                        }}
                    />
                </Panel>
            ) : (
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {coursesData.data.map((course) => {
                        const isApproved = course.reviewStatus === "APPROVED";
                        const isPending = course.reviewStatus === "PENDING_REVIEW";
                        const isRejected = course.reviewStatus === "REJECTED";
                        const isChangesRequested = course.reviewStatus === "CHANGES_REQUESTED";
                        const state = submissionState(course);

                        return (
                            <li key={course.courseId}>
                                <Panel className="flex h-full flex-col overflow-hidden">
                                    <div className="relative aspect-video w-full overflow-hidden border-b border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)]">
                                        {course.thumbnail ? (
                                            <SecureImage
                                                src={course.thumbnail}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <BookOpen
                                                    aria-hidden="true"
                                                    className="h-8 w-8 text-[var(--ls-ink-quiet)]"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute right-2 top-2">
                                            <StatusPill
                                                tone={state.tone}
                                                className="bg-[var(--ls-paper)]/95"
                                            >
                                                {state.label}
                                            </StatusPill>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-2 p-4">
                                        <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--ls-ink)]">
                                            {course.title}
                                        </h2>
                                        <p className="line-clamp-2 text-sm text-[var(--ls-ink-quiet)]">
                                            {course.description || "No description provided."}
                                        </p>

                                        {(isRejected || isChangesRequested) &&
                                        (course.rejectionReason || course.reviewNotes) ? (
                                            <div className="rounded-md border border-[var(--ls-divider)] bg-[var(--ls-risk-tint)] p-2 text-xs text-[var(--ls-risk)]">
                                                <strong>Admin feedback:</strong>{" "}
                                                {course.rejectionReason || course.reviewNotes}
                                            </div>
                                        ) : null}

                                        <div className="mt-auto flex gap-2 pt-3">
                                            <Link
                                                href={`/instructor/courses/${course.courseId}/edit`}
                                                className="flex-1"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    size="sm"
                                                >
                                                    Edit
                                                    <span className="sr-only"> {course.title}</span>
                                                </Button>
                                            </Link>
                                            {isApproved ? (
                                                <Link
                                                    href={`/instructor/courses/${course.courseId}/analytics`}
                                                    className="flex-1"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        size="sm"
                                                    >
                                                        Analytics
                                                        <span className="sr-only">
                                                            {" "}
                                                            {course.title}
                                                        </span>
                                                    </Button>
                                                </Link>
                                            ) : null}
                                            {!isApproved && !isPending ? (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={
                                                                deletingCourseId === course.courseId
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
                                    </div>
                                </Panel>
                            </li>
                        );
                    })}
                </ul>
            )}
        </LearningSurface>
    );
}
