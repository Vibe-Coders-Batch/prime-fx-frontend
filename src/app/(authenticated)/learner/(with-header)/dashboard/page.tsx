"use client";
import { useMemo } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCarousel } from "@/components/ui/course-carousel";
import { CourseCarouselSkeleton } from "@/components/ui/course-carousel-skeleton";
import { ContinueWatchingCarousel } from "@/components/ui/continue-watching-carousel";
import { HeroBanner } from "@/components/ui/hero-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { LearningSurface, Panel } from "@/components/learning/learning-surface";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useCourse, useCourses } from "@/features/courses/hooks/use-courses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LearnerDashboardPage() {
    const { user } = useAuthStore();
    const { data: enrollmentsData, isLoading: enrollmentsLoading } = useEnrollments({
        enabled: true,
        filters: {
            userId: user?.id,
            limit: 100,
        },
    });
    const { data: allCourses, isLoading: coursesLoading } = useCourses({
        enabled: true,
        filters: { status: "PUBLISHED", limit: 30 },
    });
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    // Courses the learner has live access to, in the order the catalogue
    // returns them. Drives the "continue" row.
    const continueLearning = useMemo(() => {
        if (!enrollmentsData?.data || !allCourses?.data) return [];
        const published = new Map(allCourses.data.map((course) => [course.courseId, course]));
        return enrollmentsData.data
            .filter((enrollment) => enrollment.status === "ACTIVE" && enrollment.courseId)
            .map((enrollment) => published.get(enrollment.courseId))
            .filter((course) => course !== undefined)
            .slice(0, 10);
    }, [enrollmentsData, allCourses]);

    // Genuinely newest first. The page previously showed two differently
    // labelled slices of the same unsorted list.
    const recentlyAdded = useMemo(() => {
        if (!allCourses?.data) return [];
        return [...allCourses.data]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
    }, [allCourses]);

    const heroCourseSummary = recentlyAdded.length > 0 ? recentlyAdded[0] : null;
    const { data: heroCourseDetails } = useCourse({
        enabled: !!heroCourseSummary,
        courseId: heroCourseSummary?.courseId ?? undefined,
    });
    const heroCourse = heroCourseDetails || heroCourseSummary;

    const categoryCarousels = useMemo(() => {
        if (!categories || categories.length === 0 || !allCourses?.data) return [];
        return categories.slice(0, 3).map((category) => ({
            category,
            courses: allCourses.data
                .filter((c) => c.categoryId === category.categoryId)
                .slice(0, 10),
            key: category.categoryId,
        }));
    }, [categories, allCourses]);

    const hasNoEnrolments =
        !enrollmentsLoading && enrollmentsData?.data && enrollmentsData.data.length === 0;

    if (coursesLoading || categoriesLoading) {
        return (
            <LearningSurface width="wide">
                <Skeleton className="mb-6 aspect-[21/9] w-full rounded-lg" />
                <div className="space-y-6">
                    <CourseCarouselSkeleton title="Continue learning" />
                    <CourseCarouselSkeleton title="Recently added" />
                </div>
            </LearningSurface>
        );
    }

    return (
        <LearningSurface
            width="wide"
            bleed={heroCourse ? <HeroBanner course={heroCourse} /> : null}
        >
            <div className="space-y-6">
                {continueLearning.length > 0 ? (
                    <section aria-label="Continue learning">
                        <ContinueWatchingCarousel courses={continueLearning} />
                    </section>
                ) : null}

                {recentlyAdded.length > 0 ? (
                    <section aria-label="Recently added">
                        <CourseCarousel title="Recently added" courses={recentlyAdded} />
                    </section>
                ) : null}

                {categoryCarousels.map(({ category, courses }) => {
                    if (courses.length === 0) return null;
                    return (
                        <section
                            key={category.categoryId}
                            aria-label={`Browse ${category.name}`}
                        >
                            <CourseCarousel
                                title={`Browse ${category.name}`}
                                courses={courses}
                            />
                        </section>
                    );
                })}

                {hasNoEnrolments ? (
                    <Panel>
                        <EmptyState
                            title="Start Your Learning Journey"
                            description="Explore our collection of courses and begin your path to success"
                            icon={<BookOpen className="h-12 w-12" />}
                        />
                        <div className="flex justify-center pb-8">
                            <Link href="/courses">
                                <Button size="lg" className="gap-2">
                                    <BookOpen aria-hidden="true" className="h-5 w-5" />
                                    Browse All Courses
                                </Button>
                            </Link>
                        </div>
                    </Panel>
                ) : null}
            </div>
        </LearningSurface>
    );
}
