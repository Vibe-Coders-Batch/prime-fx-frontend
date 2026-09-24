"use client";
import { useEffect, useState } from "react";
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
import { StatusPill } from "@/components/learning/status-pill";
import { presentEnrolmentStatusOnly } from "@/components/learning/enrolment-status";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import type { Enrollment } from "@/features/enrollments/types";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { EditEnrollmentDialog } from "@/features/enrollments/components/edit-enrollment-dialog";

function learnerName(enrollment: Enrollment) {
    if (!enrollment.user) return "N/A";
    return (
        `${enrollment.user.firstName || ""} ${enrollment.user.lastName || ""}`.trim() ||
        enrollment.user.email
    );
}

function enrolledOn(enrollment: Enrollment) {
    return new Date(enrollment.enrolledAt).toLocaleDateString();
}

export default function EnrollmentManagementPage() {
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 20;
    const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        data: enrollmentsData,
        isLoading,
        isFetching,
    } = useEnrollments({
        enabled: true,
        filters: {
            status: statusFilter === "all" ? undefined : statusFilter,
            search: debouncedSearch || undefined,
            page,
            limit,
        },
    });

    const handleEditClick = (enrollment: Enrollment) => {
        setEditingEnrollment(enrollment);
        setIsEditOpen(true);
    };
    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    const totalPages = enrollmentsData?.pagination?.totalPages || 1;
    const currentPage = enrollmentsData?.pagination?.page || 1;
    const total = enrollmentsData?.pagination?.total;
    const rows = enrollmentsData?.data ?? [];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Enrolment management"
                description="View and manage all course enrollments across the platform."
            />

            <div className="space-y-4">
                <Panel className="p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="relative">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ls-ink-quiet)]"
                            />
                            <Input
                                aria-label="Search enrollments"
                                placeholder="Search enrollments..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        {mounted ? (
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger aria-label="Filter enrollments by status">
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="REVOKED">Revoked</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Skeleton className="h-10 w-full" />
                        )}
                    </div>
                </Panel>

                <p aria-live="polite" className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                    {isLoading
                        ? "Loading enrollments…"
                        : total !== undefined
                          ? `${total} enrolment${total === 1 ? "" : "s"}`
                          : `${rows.length} shown`}
                </p>

                {isLoading && !isFetching ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No enrollments found"
                            description="Enrollments will appear here once users enroll in courses."
                            illustration="/illustrations/focused.svg"
                        />
                    </Panel>
                ) : (
                    <Panel className="overflow-hidden">
                        <div className={cn(isFetching && "pointer-events-none opacity-50")}>
                            {/* Desktop: dense semantic table. */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableCaption className="sr-only">
                                        Course enrollments, page {currentPage} of {totalPages}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="border-[var(--ls-divider)]">
                                            <TableHead className="min-w-[160px] text-[var(--ls-ink-quiet)]">
                                                User
                                            </TableHead>
                                            <TableHead className="min-w-[180px] text-[var(--ls-ink-quiet)]">
                                                Course
                                            </TableHead>
                                            <TableHead className="min-w-[120px] text-[var(--ls-ink-quiet)]">
                                                Company
                                            </TableHead>
                                            <TableHead className="min-w-[100px] text-[var(--ls-ink-quiet)]">
                                                Status
                                            </TableHead>
                                            <TableHead className="min-w-[110px] text-right text-[var(--ls-ink-quiet)]">
                                                Enrolled
                                            </TableHead>
                                            <TableHead className="min-w-[90px] text-right text-[var(--ls-ink-quiet)]">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.map((enrollment: Enrollment) => {
                                            const status = presentEnrolmentStatusOnly(
                                                enrollment.status,
                                            );
                                            return (
                                                <TableRow
                                                    key={enrollment.enrollmentId}
                                                    className="border-[var(--ls-divider)] hover:bg-[var(--ls-paper-quiet)]"
                                                >
                                                    <TableCell className="font-medium text-[var(--ls-ink)]">
                                                        {learnerName(enrollment)}
                                                    </TableCell>
                                                    <TableCell className="max-w-[240px] truncate text-[var(--ls-ink)]">
                                                        {enrollment.course?.title ||
                                                            "Unknown Course"}
                                                    </TableCell>
                                                    <TableCell className="text-[var(--ls-ink-quiet)]">
                                                        {enrollment.company?.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusPill tone={status.tone}>
                                                            {status.label}
                                                        </StatusPill>
                                                    </TableCell>
                                                    <TableCell className="ls-nums text-right text-[var(--ls-ink-quiet)]">
                                                        {enrolledOn(enrollment)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEditClick(enrollment)
                                                            }
                                                        >
                                                            Manage
                                                            <span className="sr-only">
                                                                {" "}
                                                                enrolment for{" "}
                                                                {learnerName(enrollment)}
                                                            </span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Narrow screens: labelled records, so the Manage action
                                stays reachable without horizontal scrolling. */}
                            <ul className="divide-y divide-[var(--ls-divider)] md:hidden">
                                {rows.map((enrollment: Enrollment) => {
                                    const status = presentEnrolmentStatusOnly(enrollment.status);
                                    return (
                                        <li
                                            key={enrollment.enrollmentId}
                                            className="space-y-3 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-[var(--ls-ink)]">
                                                        {learnerName(enrollment)}
                                                    </p>
                                                    <p className="truncate text-sm text-[var(--ls-ink-quiet)]">
                                                        {enrollment.course?.title ||
                                                            "Unknown Course"}
                                                    </p>
                                                </div>
                                                <StatusPill tone={status.tone} className="shrink-0">
                                                    {status.label}
                                                </StatusPill>
                                            </div>
                                            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                                <dt className="text-[var(--ls-ink-quiet)]">
                                                    Company
                                                </dt>
                                                <dd className="text-right text-[var(--ls-ink)]">
                                                    {enrollment.company?.name || "N/A"}
                                                </dd>
                                                <dt className="text-[var(--ls-ink-quiet)]">
                                                    Enrolled
                                                </dt>
                                                <dd className="ls-nums text-right text-[var(--ls-ink)]">
                                                    {enrolledOn(enrollment)}
                                                </dd>
                                            </dl>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleEditClick(enrollment)}
                                            >
                                                Manage
                                                <span className="sr-only">
                                                    {" "}
                                                    enrolment for {learnerName(enrollment)}
                                                </span>
                                            </Button>
                                        </li>
                                    );
                                })}
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

                <EditEnrollmentDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    enrollment={editingEnrollment}
                />
            </div>
        </LearningSurface>
    );
}
