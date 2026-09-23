"use client";
import { use } from "react";
import { BookOpen, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CourseLoading } from "@/components/ui/course-loading";
import { BackButton } from "@/components/ui/back-button";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { MetricTile } from "@/components/learning/metric-tile";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { useCoursePerformance } from "@/features/analytics/hooks/use-analytics";

export default function CourseAnalyticsPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = use(params);
    const { data: course, isLoading: courseLoading } = useCourse({ enabled: true, courseId });
    const { data: performance, isLoading: performanceLoading } = useCoursePerformance({
        enabled: true,
        courseId,
    });

    if (courseLoading || performanceLoading) {
        return <CourseLoading type="analytics" />;
    }

    if (!course) {
        return (
            <LearningSurface width="wide">
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
        <LearningSurface width="wide">
            <LearningPageHeader
                eyebrow="Performance metrics"
                title={`Course analytics: ${course.title}`}
                description="Track enrollment, completion rates, and student progress."
                actions={
                    <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <BackButton href="/instructor/courses" />
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => {
                                if (!performance) {
                                    toast.warning("No analytics data available to export");
                                    return;
                                }
                                const { exportToCSV } = require("@/lib/utils/export");
                                exportToCSV(
                                    [
                                        {
                                            Course: course?.title || "N/A",
                                            Enrollments: performance.enrollments,
                                            Completed: performance.completed,
                                            "Completion Rate": `${performance.completionRate.toFixed(2)}%`,
                                            "Average Progress": `${performance.averageProgress.toFixed(2)}%`,
                                        },
                                    ],
                                    `course_analytics_${courseId}`,
                                );
                                toast.success("Analytics data exported successfully");
                            }}
                        >
                            <Download aria-hidden="true" className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricTile
                    label="Enrolments"
                    value={(performance?.enrollments || 0).toLocaleString()}
                    hint="Total students enrolled"
                />
                <MetricTile
                    label="Completion rate"
                    value={`${(performance?.completionRate || 0).toFixed(1)}%`}
                    hint="Students who completed"
                />
                <MetricTile
                    label="Average progress"
                    value={`${(performance?.averageProgress || 0).toFixed(1)}%`}
                    hint="Average completion percentage"
                />
                <MetricTile
                    label="Completed"
                    value={(performance?.completed || 0).toLocaleString()}
                    hint="Total completions"
                />
            </div>
        </LearningSurface>
    );
}
