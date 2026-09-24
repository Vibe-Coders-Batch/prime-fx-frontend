"use client";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { FileText, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { StatusPill } from "@/components/learning/status-pill";
import { useCourses } from "@/lib/hooks/use-courses";

export default function AdminCourseReviewsPage() {
    const router = useRouter();
    const { data, isLoading } = useCourses({ filters: { limit: 100 } });
    const pendingCourses = data?.data.filter((c) => c.reviewStatus === "PENDING_REVIEW") || [];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Course reviews"
                description="Review and approve instructor submitted courses."
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2
                        aria-hidden="true"
                        className="h-8 w-8 animate-spin text-[var(--ls-ink-quiet)]"
                    />
                </div>
            ) : pendingCourses.length === 0 ? (
                <Panel>
                    <EmptyState
                        title="No pending reviews"
                        description="All caught up. No courses are waiting for approval."
                    />
                </Panel>
            ) : (
                <>
                    <p aria-live="polite" className="ls-nums mb-4 text-sm text-[var(--ls-ink-quiet)]">
                        {pendingCourses.length} course{pendingCourses.length === 1 ? "" : "s"}{" "}
                        awaiting review
                    </p>
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingCourses.map((course) => (
                            <li key={course.courseId}>
                                <Panel className="flex h-full flex-col p-5">
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <StatusPill tone="warn">Pending review</StatusPill>
                                        <span className="ls-nums text-xs text-[var(--ls-ink-quiet)]">
                                            {course.submittedAt
                                                ? formatDistanceToNow(new Date(course.submittedAt), {
                                                      addSuffix: true,
                                                  })
                                                : "Recently"}
                                        </span>
                                    </div>
                                    <h2 className="line-clamp-2 text-sm font-semibold text-[var(--ls-ink)]">
                                        {course.title}
                                    </h2>
                                    <p className="mt-1 line-clamp-2 text-sm text-[var(--ls-ink-quiet)]">
                                        {course.description}
                                    </p>

                                    <dl className="mt-4 space-y-1.5 text-sm text-[var(--ls-ink-quiet)]">
                                        <div className="flex items-center gap-2">
                                            <User aria-hidden="true" className="h-4 w-4 shrink-0" />
                                            <dt className="sr-only">Instructor</dt>
                                            <dd>
                                                {course.instructor?.firstName}{" "}
                                                {course.instructor?.lastName}
                                            </dd>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText
                                                aria-hidden="true"
                                                className="h-4 w-4 shrink-0"
                                            />
                                            <dt className="sr-only">Sections</dt>
                                            <dd className="ls-nums">
                                                {course.sections?.length || 0} sections
                                            </dd>
                                        </div>
                                    </dl>

                                    <Button
                                        className="mt-5 w-full"
                                        onClick={() =>
                                            router.push(
                                                `/admin/courses/reviews/${course.courseId}`,
                                            )
                                        }
                                    >
                                        Review Course
                                        <span className="sr-only"> {course.title}</span>
                                    </Button>
                                </Panel>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </LearningSurface>
    );
}
