"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { StatusPill, type StatusTone } from "@/components/learning/status-pill";
import { sentenceCaseEnum } from "@/components/learning/format";
import { useCourses } from "@/features/courses/hooks/use-courses";
import type { CourseFilters } from "@/features/courses/types";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

type StatusFilterValue = "all" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

/** The row shape this list actually receives, taken straight from the hook
 *  so the table stays in step with the service response. */
type CourseRow = NonNullable<ReturnType<typeof useCourses>["data"]>["data"][number];

/** Same tone split the table has always used: published reads as settled,
 *  draft as in-hand, everything else as inert. */
function courseStatusTone(status: CourseRow["status"]): StatusTone {
    if (status === "PUBLISHED") return "ok";
    if (status === "DRAFT") return "warn";
    return "neutral";
}

function reviewStatusTone(reviewStatus: NonNullable<CourseRow["reviewStatus"]>): StatusTone {
    if (reviewStatus === "PENDING_REVIEW") return "warn";
    if (reviewStatus === "APPROVED") return "ok";
    return "neutral";
}

function instructorName(course: CourseRow) {
    if (!course.instructor) return "N/A";
    return (
        `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim() ||
        course.instructor.email
    );
}

function coursePrice(course: CourseRow) {
    return `${course.currency} ${parseFloat(course.price).toFixed(2)}`;
}

function RowActions({ course }: { course: CourseRow }) {
    return (
        <>
            <Link href={`/admin/courses/${course.courseId}`}>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    View
                    <span className="sr-only"> {course.title}</span>
                </Button>
            </Link>
            <Link href={`/admin/courses/${course.courseId}`}>
                <Button variant="default" size="sm" className="w-full sm:w-auto">
                    Review
                    <span className="sr-only"> {course.title}</span>
                </Button>
            </Link>
        </>
    );
}

export default function AdminCourseManagementPage() {
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        setMounted(true);
    }, []);

    const getStatusFilter = (): CourseFilters["status"] => {
        if (statusFilter === "all") return undefined;
        return statusFilter;
    };

    const handleStatusFilterChange = (value: string) => {
        if (
            value === "all" ||
            value === "DRAFT" ||
            value === "PUBLISHED" ||
            value === "ARCHIVED"
        ) {
            setStatusFilter(value);
            setPage(1);
        }
    };

    const { data: coursesData, isLoading, isError, isFetching } = useCourses({
        enabled: true,
        filters: {
            search: debouncedSearch || undefined,
            status: getStatusFilter(),
            categoryId: categoryFilter === "all" ? undefined : categoryFilter,
            page,
            limit,
        },
    });

    const totalPages = coursesData?.pagination?.totalPages || 1;
    const currentPage = coursesData?.pagination?.page || 1;
    const total = coursesData?.pagination?.total;
    const rows = coursesData?.data ?? [];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Course management"
                description="Manage all courses, approve content, and moderate course listings."
            />

            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative max-w-md flex-1">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ls-ink-quiet)]"
                        />
                        <Input
                            aria-label="Search courses"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 pl-8 text-sm"
                        />
                    </div>
                    {mounted ? (
                        <>
                            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger
                                    aria-label="Filter courses by status"
                                    className="h-9 w-full text-sm sm:w-[160px]"
                                >
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All status</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger
                                    aria-label="Filter courses by category"
                                    className="h-9 w-full text-sm sm:w-[160px]"
                                >
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-9 w-full sm:w-[160px]" />
                            <Skeleton className="h-9 w-full sm:w-[160px]" />
                        </>
                    )}
                </div>

                <p aria-live="polite" className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                    {isLoading
                        ? "Loading courses…"
                        : isError
                          ? "Courses could not be loaded"
                          : total !== undefined
                            ? `${total} course${total === 1 ? "" : "s"}`
                            : `${rows.length} shown`}
                </p>

                {isLoading && !isFetching ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                    </div>
                ) : isError ? (
                    <Panel>
                        <EmptyState
                            title="Error loading courses"
                            description="There was a problem loading the courses. Please try again."
                            illustration="/illustrations/no_data.svg"
                        />
                    </Panel>
                ) : rows.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No courses found"
                            description="Courses will appear here once instructors create them."
                            illustration="/illustrations/no_data.svg"
                        />
                    </Panel>
                ) : (
                    <Panel className="overflow-hidden">
                        <div className={cn(isFetching && "pointer-events-none opacity-50")}>
                            {/* Desktop: dense semantic table. */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableCaption className="sr-only">
                                        Courses, page {currentPage} of {totalPages}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="border-[var(--ls-divider)]">
                                            <TableHead className="min-w-[220px] text-[var(--ls-ink-quiet)]">
                                                Title
                                            </TableHead>
                                            <TableHead className="min-w-[120px] text-[var(--ls-ink-quiet)]">
                                                Category
                                            </TableHead>
                                            <TableHead className="min-w-[150px] text-[var(--ls-ink-quiet)]">
                                                Instructor
                                            </TableHead>
                                            <TableHead className="min-w-[100px] text-[var(--ls-ink-quiet)]">
                                                Status
                                            </TableHead>
                                            <TableHead className="min-w-[130px] text-[var(--ls-ink-quiet)]">
                                                Review status
                                            </TableHead>
                                            <TableHead className="min-w-[110px] text-right text-[var(--ls-ink-quiet)]">
                                                Price
                                            </TableHead>
                                            <TableHead className="min-w-[110px] text-right text-[var(--ls-ink-quiet)]">
                                                Created
                                            </TableHead>
                                            <TableHead className="min-w-[140px] text-right text-[var(--ls-ink-quiet)]">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.map((course) => (
                                            <TableRow
                                                key={course.courseId}
                                                className="border-[var(--ls-divider)] hover:bg-[var(--ls-paper-quiet)]"
                                            >
                                                <TableCell className="font-medium text-[var(--ls-ink)]">
                                                    {course.title}
                                                </TableCell>
                                                <TableCell className="text-[var(--ls-ink-quiet)]">
                                                    {course.category?.name || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-[var(--ls-ink-quiet)]">
                                                    {instructorName(course)}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusPill tone={courseStatusTone(course.status)}>
                                                        {sentenceCaseEnum(course.status)}
                                                    </StatusPill>
                                                </TableCell>
                                                <TableCell>
                                                    {course.reviewStatus ? (
                                                        <StatusPill
                                                            tone={reviewStatusTone(
                                                                course.reviewStatus,
                                                            )}
                                                        >
                                                            {sentenceCaseEnum(course.reviewStatus)}
                                                        </StatusPill>
                                                    ) : null}
                                                </TableCell>
                                                <TableCell className="ls-nums text-right text-[var(--ls-ink)]">
                                                    {coursePrice(course)}
                                                </TableCell>
                                                <TableCell className="ls-nums text-right text-[var(--ls-ink-quiet)]">
                                                    {new Date(
                                                        course.createdAt,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-wrap justify-end gap-2">
                                                        <RowActions course={course} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Narrow screens: labelled records so both row actions
                                stay reachable without horizontal scrolling. */}
                            <ul className="divide-y divide-[var(--ls-divider)] lg:hidden">
                                {rows.map((course) => (
                                    <li key={course.courseId} className="space-y-3 p-4">
                                        <div className="space-y-1.5">
                                            <p className="font-medium text-[var(--ls-ink)]">
                                                {course.title}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                <StatusPill tone={courseStatusTone(course.status)}>
                                                    {sentenceCaseEnum(course.status)}
                                                </StatusPill>
                                                {course.reviewStatus ? (
                                                    <StatusPill
                                                        tone={reviewStatusTone(course.reviewStatus)}
                                                    >
                                                        {sentenceCaseEnum(course.reviewStatus)}
                                                    </StatusPill>
                                                ) : null}
                                            </div>
                                        </div>
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                            <dt className="text-[var(--ls-ink-quiet)]">Category</dt>
                                            <dd className="text-right text-[var(--ls-ink)]">
                                                {course.category?.name || "N/A"}
                                            </dd>
                                            <dt className="text-[var(--ls-ink-quiet)]">
                                                Instructor
                                            </dt>
                                            <dd className="truncate text-right text-[var(--ls-ink)]">
                                                {instructorName(course)}
                                            </dd>
                                            <dt className="text-[var(--ls-ink-quiet)]">Price</dt>
                                            <dd className="ls-nums text-right text-[var(--ls-ink)]">
                                                {coursePrice(course)}
                                            </dd>
                                            <dt className="text-[var(--ls-ink-quiet)]">Created</dt>
                                            <dd className="ls-nums text-right text-[var(--ls-ink)]">
                                                {new Date(course.createdAt).toLocaleDateString()}
                                            </dd>
                                        </dl>
                                        <div className="flex gap-2">
                                            <RowActions course={course} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {totalPages > 1 ? (
                            <div className="flex items-center justify-between border-t border-[var(--ls-divider)] px-4 py-3">
                                <div className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1 || isFetching}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || isFetching}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </Panel>
                )}
            </div>
        </LearningSurface>
    );
}
