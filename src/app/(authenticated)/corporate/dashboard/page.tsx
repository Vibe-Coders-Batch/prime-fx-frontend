"use client";
import { StatsCardSkeleton } from "@/components/cards/stats-card-skeleton";
import { SimpleBarChart } from "@/components/ui/simple-chart";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { MetricTile } from "@/components/learning/metric-tile";
import { useUsers } from "@/features/users/hooks/use-users";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import type { Enrollment } from "@/features/enrollments/types";
import { useAuthStore } from "@/lib/store/auth-store";

export default function CorporateDashboardPage() {
    const { user } = useAuthStore();
    const { data: usersData, isLoading: usersLoading } = useUsers({
        enabled: true,
        filters: { companyId: user?.companyId ?? undefined, limit: 1000 },
    });
    const { data: enrollmentsData, isLoading: enrollmentsLoading } = useEnrollments({
        enabled: true,
        filters: { companyId: user?.companyId ?? undefined, limit: 1000 },
    });

    const usersArray = Array.isArray(usersData) ? usersData : (usersData as any)?.data || [];
    const enrollmentsArray = Array.isArray(enrollmentsData)
        ? enrollmentsData
        : (enrollmentsData as any)?.data || [];

    const totalUsers = usersArray.length;
    const activeEnrollments = enrollmentsArray.filter(
        (e: Enrollment) => e.status === "ACTIVE",
    ).length;
    const completedEnrollments = enrollmentsArray.filter(
        (e: Enrollment) => e.status === "COMPLETED",
    ).length;
    const totalCourses = new Set(enrollmentsArray.map((e: Enrollment) => e.courseId)).size;

    const enrollmentBreakdown = [
        { label: "Active", value: activeEnrollments, color: "bg-[var(--ls-accent)]" },
        { label: "Completed", value: completedEnrollments, color: "bg-[var(--ls-ok)]" },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                eyebrow="Company overview and analytics"
                title="Corporate dashboard"
                description="Manage your team's learning, track enrollment progress, and monitor analytics."
            />

            <div className="space-y-6">
                <section aria-labelledby="totals-heading" className="space-y-3">
                    <SectionHeading id="totals-heading" title="Company totals" />
                    {usersLoading || enrollmentsLoading ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <MetricTile
                                label="Total users"
                                value={totalUsers.toLocaleString()}
                                hint="Employees in your company"
                            />
                            <MetricTile
                                label="Active enrolments"
                                value={activeEnrollments.toLocaleString()}
                                hint="Current course enrollments"
                            />
                            <MetricTile
                                label="Completed"
                                value={completedEnrollments.toLocaleString()}
                                hint="Completed enrollments"
                            />
                            <MetricTile
                                label="Courses assigned"
                                value={totalCourses.toLocaleString()}
                                hint="Total courses assigned"
                            />
                        </div>
                    )}
                </section>

                <section aria-labelledby="breakdown-heading" className="space-y-3">
                    <SectionHeading
                        id="breakdown-heading"
                        title="Enrolment status breakdown"
                    />
                    <Panel className="p-4">
                        <SimpleBarChart data={enrollmentBreakdown} height={150} noCard />
                    </Panel>
                </section>
            </div>
        </LearningSurface>
    );
}
