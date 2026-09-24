"use client";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { OpsList, ResultCount, type OpsColumn } from "@/components/learning/ops-list";
import { StatusPill } from "@/components/learning/status-pill";
import { presentEnrolmentStatusOnly } from "@/components/learning/enrolment-status";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import type { Enrollment } from "@/features/enrollments/types";
import { useAuthStore } from "@/lib/store/auth-store";

function learnerName(enrollment: Enrollment) {
    if (!enrollment.user) return "N/A";
    return (
        `${enrollment.user.firstName || ""} ${enrollment.user.lastName || ""}`.trim() ||
        enrollment.user.email
    );
}

export default function BulkEnrollmentPage() {
    const [mounted, setMounted] = useState(false);
    const { user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: enrollmentsData, isLoading } = useEnrollments({
        enabled: true,
        filters: {
            companyId: user?.companyId ?? undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
            limit: 100,
        },
    });

    const filteredEnrollments = enrollmentsData?.data.filter((enrollment: Enrollment) => {
        if (search) {
            const courseTitle = enrollment.course?.title.toLowerCase() || "";
            const userName =
                `${enrollment.user?.firstName || ""} ${enrollment.user?.lastName || ""}`.toLowerCase();
            return (
                courseTitle.includes(search.toLowerCase()) ||
                userName.includes(search.toLowerCase())
            );
        }
        return true;
    });

    const rows = filteredEnrollments ?? [];

    const columns: OpsColumn<Enrollment>[] = [
        { key: "user", header: "User", primary: true, cell: learnerName },
        {
            key: "course",
            header: "Course",
            secondary: true,
            cell: (enrollment) => enrollment.course?.title || "Unknown Course",
        },
        {
            key: "status",
            header: "Status",
            badge: true,
            cell: (enrollment) => {
                const status = presentEnrolmentStatusOnly(enrollment.status);
                return <StatusPill tone={status.tone}>{status.label}</StatusPill>;
            },
        },
        {
            key: "enrolled",
            header: "Enrolled",
            numeric: true,
            cell: (enrollment) => new Date(enrollment.enrolledAt).toLocaleDateString(),
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                eyebrow="Corporate"
                title="Bulk enrolment"
                description="Enroll multiple users to courses at once using CSV upload or manual selection."
                actions={
                    <Button
                        onClick={() => {
                            toast.info(
                                "Bulk enrollment feature coming soon. You'll be able to enroll multiple users via CSV upload.",
                            );
                        }}
                    >
                        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                        Bulk Enroll
                    </Button>
                }
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
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

                <ResultCount
                    isLoading={isLoading}
                    total={rows.length}
                    shown={rows.length}
                    noun="enrolment"
                />

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No enrollments found"
                            description="Enroll users to courses to see them here."
                            icon={<BookOpen className="h-12 w-12" />}
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption="Company enrolments"
                        columns={columns}
                        rows={rows}
                        getRowKey={(enrollment) => enrollment.enrollmentId}
                        renderActions={(enrollment) => (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    toast.info(
                                        `Enrollment management for ${enrollment.enrollmentId}: feature coming soon`,
                                    );
                                }}
                            >
                                Manage
                                <span className="sr-only"> {learnerName(enrollment)}</span>
                            </Button>
                        )}
                    />
                )}
            </div>
        </LearningSurface>
    );
}
