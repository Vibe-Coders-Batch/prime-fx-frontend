"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Layers, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecureImage } from "@/components/ui/secure-image";
import { Skeleton } from "@/components/ui/skeleton";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { StatusPill } from "@/components/learning/status-pill";
import { presentEnrolmentStatus } from "@/components/learning/enrolment-status";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Enrollment } from "@/features/enrollments/types";

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

interface RecordAction {
    label: string;
    href: string;
    variant: "default" | "outline";
}

/**
 * Revoked access has no player to resume, so it links to the course page
 * instead — the same place the player sends a learner who cannot open it.
 */
function recordAction(enrolment: Enrollment): RecordAction {
    const watch = `/learner/courses/${enrolment.courseId}/watch`;
    if (enrolment.status === "REVOKED") {
        return {
            label: "View course",
            href: `/learner/courses/${enrolment.courseId}`,
            variant: "outline",
        };
    }
    if (enrolment.accessType === "SECTION") {
        return { label: "Watch section", href: watch, variant: "default" };
    }
    if (enrolment.status === "COMPLETED") {
        return { label: "Review course", href: watch, variant: "outline" };
    }
    return { label: "Resume course", href: watch, variant: "default" };
}

function CourseThumbnail({ enrolment }: { enrolment: Enrollment }) {
    if (enrolment.course?.thumbnail) {
        return (
            <SecureImage
                src={enrolment.course.thumbnail}
                alt=""
                className="h-full w-full object-cover"
            />
        );
    }
    return (
        <div className="flex h-full w-full items-center justify-center">
            <BookOpen aria-hidden="true" className="h-6 w-6 text-[var(--ls-ink-quiet)]" />
        </div>
    );
}

/** Compact enrolment record: one scannable row per course. */
function EnrolmentRecord({ enrolment }: { enrolment: Enrollment }) {
    const status = presentEnrolmentStatus(enrolment);
    const action = recordAction(enrolment);
    const title = enrolment.course?.title || "Unknown Course";
    const sections = enrolment.accessedSections ?? [];

    return (
        <li className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
            <div className="h-20 w-32 shrink-0 overflow-hidden rounded-md border border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)] sm:h-16 sm:w-24">
                <CourseThumbnail enrolment={enrolment} />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5">
                    <h3 className="min-w-0 text-[0.95rem] font-semibold leading-snug text-[var(--ls-ink)]">
                        {title}
                    </h3>
                    <StatusPill
                        tone={status.tone}
                        icon={
                            status.label === "Section access" ? (
                                <Layers className="h-3 w-3" />
                            ) : undefined
                        }
                    >
                        {status.label}
                    </StatusPill>
                </div>

                <p className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                    {enrolment.accessType === "SECTION" ? "Purchased on" : "Enrolled on"}{" "}
                    {formatDate(enrolment.enrolledAt)}
                    {enrolment.course?.category?.name ? (
                        <span className="text-[var(--ls-divider-strong)]"> · </span>
                    ) : null}
                    {enrolment.course?.category?.name}
                </p>

                {enrolment.accessType === "SECTION" && sections.length > 0 ? (
                    <div className="rounded-md border border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)] p-2.5">
                        <p className="text-xs font-medium text-[var(--ls-ink)]">
                            Access to {sections.length} section{sections.length > 1 ? "s" : ""}
                        </p>
                        <ul className="mt-1 space-y-0.5 text-xs text-[var(--ls-ink-quiet)]">
                            {sections.slice(0, 3).map((section) => (
                                <li key={section.sectionId} className="truncate">
                                    {section.title}
                                </li>
                            ))}
                            {sections.length > 3 ? (
                                <li className="ls-nums">+ {sections.length - 3} more</li>
                            ) : null}
                        </ul>
                    </div>
                ) : null}

                {enrolment.accessType !== "SECTION" && enrolment.course?.description ? (
                    <p className="line-clamp-2 text-sm leading-relaxed text-[var(--ls-ink-quiet)]">
                        {enrolment.course.description}
                    </p>
                ) : null}
            </div>

            <div className="sm:shrink-0 sm:self-center">
                <Link href={action.href} className="block">
                    <Button className="w-full sm:w-auto" variant={action.variant}>
                        <span>{action.label}</span>
                        <span className="sr-only"> — {title}</span>
                    </Button>
                </Link>
            </div>
        </li>
    );
}

export default function MyCoursesPage() {
    const [mounted, setMounted] = useState(false);
    const { user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: enrollmentsData, isLoading } = useEnrollments({
        enabled: true,
        refetchOnMount: true,
        filters: {
            userId: user?.id,
            status: statusFilter === "all" ? undefined : statusFilter,
            page,
            limit: 12,
        },
    });

    const pagination = enrollmentsData?.pagination;
    const enrolments = useMemo(() => enrollmentsData?.data ?? [], [enrollmentsData]);

    const visible = useMemo(() => {
        if (!search) return enrolments;
        const needle = search.toLowerCase();
        return enrolments.filter((enrolment) =>
            (enrolment.course?.title.toLowerCase() || "").includes(needle),
        );
    }, [enrolments, search]);

    // Lead with the course the learner is most likely to open next. Derived
    // from the enrolments already on screen: no extra request, no invented data.
    const resumeNext = useMemo(() => {
        if (page !== 1 || search) return null;
        const active = enrolments.filter((enrolment) => enrolment.status === "ACTIVE");
        if (active.length === 0) return null;
        return [...active].sort(
            (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
        )[0];
    }, [enrolments, page, search]);

    return (
        <LearningSurface>
            <LearningPageHeader
                title="My courses"
                description="Continue your learning journey with your enrolled courses."
            />

            {resumeNext ? (
                <section aria-label="Most recent enrolment">
                <Panel className="mb-6 overflow-hidden">
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                        <div className="h-24 w-full shrink-0 overflow-hidden rounded-md border border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)] sm:h-20 sm:w-32">
                            <CourseThumbnail enrolment={resumeNext} />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-xs font-medium text-[var(--ls-ink-quiet)]">
                                Most recent enrolment
                            </p>
                            <h2 className="truncate text-lg font-semibold text-[var(--ls-ink)]">
                                {resumeNext.course?.title || "Unknown Course"}
                            </h2>
                            <p className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                                Enrolled on {formatDate(resumeNext.enrolledAt)}
                            </p>
                        </div>
                        <div className="sm:shrink-0">
                            <Link
                                href={`/learner/courses/${resumeNext.courseId}/watch`}
                                className="block"
                            >
                                <Button className="w-full sm:w-auto">
                                    <span>Resume course</span>
                                    <span className="sr-only">
                                        {" "}
                                        — {resumeNext.course?.title || "Unknown Course"}
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Panel>
                </section>
            ) : null}

            <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <div className="relative w-full max-w-md flex-1">
                        <Search
                            aria-hidden="true"
                            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ls-ink-quiet)]"
                        />
                        <Input
                            aria-label="Search your courses by title"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 pl-8 text-sm"
                        />
                    </div>
                    {mounted ? (
                        <Select
                            value={statusFilter}
                            onValueChange={(val) => {
                                setStatusFilter(val);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger
                                aria-label="Filter courses by status"
                                className="h-9 w-full text-sm sm:w-[160px]"
                            >
                                <SelectValue placeholder="All status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="ACTIVE">In progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="REVOKED">Revoked</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="w-full sm:w-[160px]">
                            <Skeleton className="h-9 w-full" />
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <Panel>
                        <ul className="divide-y divide-[var(--ls-divider)]">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <li key={i} className="flex gap-5 p-5">
                                    <Skeleton className="h-16 w-24 shrink-0 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-2/5" />
                                        <Skeleton className="h-3 w-1/4" />
                                        <Skeleton className="h-3 w-3/5" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Panel>
                ) : visible.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No courses found"
                            description={
                                search
                                    ? "No courses match your search. Try different keywords."
                                    : "Start your learning journey by enrolling in a course."
                            }
                            icon={<BookOpen className="h-12 w-12" />}
                            action={
                                !search
                                    ? {
                                          label: "Browse Courses",
                                          onClick: () => (window.location.href = "/courses"),
                                      }
                                    : undefined
                            }
                        />
                    </Panel>
                ) : (
                    <section aria-labelledby="enrolments-heading" className="space-y-3">
                        <SectionHeading
                            id="enrolments-heading"
                            title="Enrolled courses"
                            count={
                                pagination?.total !== undefined && !search
                                    ? `${pagination.total}`
                                    : `${visible.length}`
                            }
                        />
                        <Panel className="overflow-hidden">
                            <ul className="divide-y divide-[var(--ls-divider)]">
                                {visible.map((enrolment) => (
                                    <EnrolmentRecord
                                        key={enrolment.enrollmentId}
                                        enrolment={enrolment}
                                    />
                                ))}
                            </ul>
                        </Panel>
                    </section>
                )}

                {pagination && pagination.totalPages && pagination.totalPages > 1 ? (
                    <div className="mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(newPage) => {
                                setPage(newPage);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        />
                    </div>
                ) : null}
            </div>
        </LearningSurface>
    );
}
