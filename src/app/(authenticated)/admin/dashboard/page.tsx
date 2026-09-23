"use client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleBarChart, SimpleLineChart } from "@/components/ui/simple-chart";
import { StatsCardSkeleton } from "@/components/cards/stats-card-skeleton";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { MetricTile } from "@/components/learning/metric-tile";
import {
    useEnrollmentStats,
    useEnrollmentTrend,
    usePlatformStats,
    useRevenueStats,
    useRevenueTrend,
    useTopCourses,
} from "@/features/analytics/hooks/use-analytics";

/** Display formatting only: the CSV export still carries the raw values. */
function count(value: number) {
    return value.toLocaleString();
}

function money(value: number) {
    return `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = usePlatformStats();
    const { data: enrollmentStats } = useEnrollmentStats();
    const { data: revenueStats } = useRevenueStats();
    const { data: enrollmentTrendData } = useEnrollmentTrend({
        enabled: true,
        filters: { period: "day", days: 30 },
    });
    const { data: revenueTrendData } = useRevenueTrend({
        enabled: true,
        filters: { period: "day", days: 30 },
    });
    const { data: topCourses } = useTopCourses({ enabled: true, filters: { limit: 5 } });

    const enrollmentTrend = Array.isArray(enrollmentTrendData)
        ? enrollmentTrendData.map((item: any) => ({
              label: item.date || "",
              value: Number(item.value || 0),
          }))
        : [];
    const revenueTrend = Array.isArray(revenueTrendData)
        ? revenueTrendData.map((item: { date: string; revenue?: number; value?: number }) => ({
              label: item.date,
              value: item.revenue ?? item.value ?? 0,
          }))
        : [];
    const enrollmentBreakdown = [
        {
            label: "B2C",
            value: (enrollmentStats as any)?.b2c || 0,
            color: "bg-[var(--ls-accent)]",
        },
        {
            label: "B2B",
            value: (enrollmentStats as any)?.b2b || 0,
            color: "bg-[var(--ls-ok)]",
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Admin dashboard"
                description="Monitor platform metrics, analytics, and manage all aspects of the system."
                actions={
                    <Button
                        variant="outline"
                        onClick={() => {
                            const data = [
                                { Metric: "Total Users", Value: (stats as any)?.totalUsers || 0 },
                                {
                                    Metric: "Total Courses",
                                    Value: (stats as any)?.totalCourses || 0,
                                },
                                {
                                    Metric: "Total Enrollments",
                                    Value: (stats as any)?.totalEnrollments || 0,
                                },
                                {
                                    Metric: "Revenue",
                                    Value: `$${(revenueStats as any)?.total || 0}`,
                                },
                            ];
                            const { exportToCSV } = require("@/lib/utils/export");
                            exportToCSV(data, "admin_dashboard_export");
                        }}
                    >
                        <Download aria-hidden="true" className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                }
            />

            <div className="space-y-6">
                <section aria-labelledby="metrics-heading" className="space-y-3">
                    <SectionHeading id="metrics-heading" title="Platform totals" />
                    {stats && !isLoading ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <MetricTile
                                label="Total users"
                                value={count((stats as any)?.totalUsers || 0)}
                                hint="All platform users"
                            />
                            <MetricTile
                                label="Total courses"
                                value={count((stats as any)?.totalCourses || 0)}
                                hint="Published courses"
                            />
                            <MetricTile
                                label="Total enrolments"
                                value={count((stats as any)?.totalEnrollments || 0)}
                                hint="Course enrollments"
                            />
                            <MetricTile
                                label="Revenue"
                                value={money((revenueStats as any)?.total || 0)}
                                hint="Total platform revenue"
                            />
                        </div>
                    ) : isLoading ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                        </div>
                    ) : (
                        <Panel className="p-4">
                            <p className="text-sm text-[var(--ls-risk)]">
                                Failed to load stats. Please try refreshing.
                            </p>
                        </Panel>
                    )}
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                    <section aria-labelledby="breakdown-heading" className="space-y-3">
                        <SectionHeading id="breakdown-heading" title="Enrolment breakdown" />
                        <Panel className="p-4">
                            <SimpleBarChart data={enrollmentBreakdown} height={150} noCard />
                        </Panel>
                    </section>

                    <section aria-labelledby="enrol-trend-heading" className="space-y-3">
                        <SectionHeading
                            id="enrol-trend-heading"
                            title="Enrolment trend"
                            description="Last 30 days"
                        />
                        <Panel className="p-4">
                            <SimpleLineChart
                                data={
                                    enrollmentTrend.length > 0
                                        ? enrollmentTrend
                                        : [{ label: "No data", value: 0 }]
                                }
                                height={150}
                                noCard
                            />
                        </Panel>
                    </section>

                    <section aria-labelledby="revenue-trend-heading" className="space-y-3">
                        <SectionHeading
                            id="revenue-trend-heading"
                            title="Revenue trend"
                            description="Last 30 days"
                        />
                        <Panel className="p-4">
                            <SimpleLineChart
                                data={
                                    revenueTrend.length > 0
                                        ? revenueTrend
                                        : [{ label: "No data", value: 0 }]
                                }
                                height={200}
                                noCard
                            />
                        </Panel>
                    </section>

                    {Array.isArray(topCourses) && topCourses.length > 0 ? (
                        <section aria-labelledby="top-courses-heading" className="space-y-3">
                            <SectionHeading
                                id="top-courses-heading"
                                title="Top performing courses"
                            />
                            <Panel className="overflow-hidden">
                                <ol className="divide-y divide-[var(--ls-divider)]">
                                    {(
                                        topCourses as {
                                            courseId: string;
                                            courseTitle: string;
                                            enrollments: number;
                                        }[]
                                    ).map((course, index) => (
                                        <li
                                            key={course.courseId}
                                            className="flex items-center gap-3 px-4 py-2.5"
                                        >
                                            <span className="ls-nums w-5 shrink-0 text-sm text-[var(--ls-ink-quiet)]">
                                                {index + 1}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--ls-ink)]">
                                                {course.courseTitle}
                                            </span>
                                            <span className="ls-nums shrink-0 text-sm text-[var(--ls-ink-quiet)]">
                                                {course.enrollments} enrolments
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </Panel>
                        </section>
                    ) : null}
                </div>
            </div>
        </LearningSurface>
    );
}
