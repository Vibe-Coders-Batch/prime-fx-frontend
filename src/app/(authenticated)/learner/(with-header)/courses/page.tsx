"use client";
import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { CourseCarousel } from "@/components/ui/course-carousel";
import { CourseCarouselSkeleton } from "@/components/ui/course-carousel-skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useCategories } from "@/features/categories/hooks/use-categories";

export default function CoursesPage() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const { data: coursesData, isLoading } = useCourses({
        enabled: true,
        filters: {
            search: search || undefined,
            categoryId: categoryFilter === "all" ? undefined : categoryFilter,
            status: "PUBLISHED",
            limit: 100,
        },
    });
    const { data: enrollmentsData } = useEnrollments({
        enabled: true,
        filters: { limit: 1000 },
    });
    const enrolledCourseIds = useMemo(
        () => new Set(enrollmentsData?.data?.map((e) => e.courseId) || []),
        [enrollmentsData?.data],
    );
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const coursesByCategory = useMemo(() => {
        if (!categories || !coursesData?.data) return [];
        if (categoryFilter !== "all") {
            const selectedCategory = categories.find((c) => c.categoryId === categoryFilter);
            if (!selectedCategory) return [];
            const categoryCourses = coursesData.data.filter(
                (course) => course.categoryId === categoryFilter,
            );
            return categoryCourses.length > 0
                ? [{ category: selectedCategory, courses: categoryCourses }]
                : [];
        }
        return categories
            .map((category) => ({
                category,
                courses: coursesData.data.filter(
                    (course) => course.categoryId === category.categoryId,
                ),
            }))
            .filter((item) => item.courses.length > 0);
    }, [categories, coursesData, categoryFilter]);

    const totalShown = coursesByCategory.reduce((acc, item) => acc + item.courses.length, 0);

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Browse courses"
                description="Discover our comprehensive collection of courses designed to enhance your skills and knowledge."
            />

            <div className="space-y-6">
                <Panel className="p-4">
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
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger
                                aria-label="Filter courses by category"
                                className="h-9 w-full text-sm sm:w-[200px]"
                            >
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {categories?.map((category) => (
                                    <SelectItem
                                        key={category.categoryId}
                                        value={category.categoryId}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </Panel>

                {isLoading || categoriesLoading ? (
                    <div className="space-y-6">
                        <CourseCarouselSkeleton title="Loading..." />
                        <CourseCarouselSkeleton title="Loading..." />
                        <CourseCarouselSkeleton title="Loading..." />
                    </div>
                ) : coursesByCategory.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No courses found"
                            description={
                                search
                                    ? "No courses match your search. Try different keywords."
                                    : categoryFilter !== "all"
                                      ? "No courses found in this category."
                                      : "No courses available yet."
                            }
                            icon={<BookOpen className="h-12 w-12" />}
                        />
                    </Panel>
                ) : (
                    <>
                        <p aria-live="polite" className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                            {totalShown} course{totalShown === 1 ? "" : "s"} in{" "}
                            {coursesByCategory.length} categor
                            {coursesByCategory.length === 1 ? "y" : "ies"}
                        </p>
                        <div className="space-y-6">
                            {coursesByCategory.map(({ category, courses }) => (
                                <section key={category.categoryId} aria-label={category.name}>
                                    <CourseCarousel
                                        title={category.name}
                                        courses={courses}
                                        enrolledCourseIds={enrolledCourseIds}
                                    />
                                </section>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </LearningSurface>
    );
}
