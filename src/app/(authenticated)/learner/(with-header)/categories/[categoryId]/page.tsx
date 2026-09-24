"use client";
import { use, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SecureImage } from "@/components/ui/secure-image";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { useCategoryBySlug } from "@/features/categories/hooks/use-categories";
import { useCourses } from "@/features/courses/hooks/use-courses";

export default function CategoryPage({
    params,
}: {
    params: Promise<{ categoryId: string }>;
}) {
    // Route params are a promise in this Next version; the previous synchronous
    // read resolved to undefined, so the category never loaded.
    const { categoryId } = use(params);
    const [page, setPage] = useState(1);

    const { data: category, isLoading: categoryLoading } = useCategoryBySlug({
        enabled: true,
        slug: categoryId,
    });
    const { data: coursesData, isLoading: coursesLoading } = useCourses({
        enabled: true,
        filters: {
            categoryId: category?.categoryId,
            status: "PUBLISHED",
            page,
            limit: 12,
        },
    });

    if (categoryLoading) {
        return (
            <LearningSurface width="wide">
                <LearningPageHeader title="Loading..." />
                <Skeleton className="h-64 w-full rounded-lg" />
            </LearningSurface>
        );
    }

    if (!category) {
        return (
            <LearningSurface width="wide">
                <LearningPageHeader title="Category not found" />
                <Panel>
                    <EmptyState
                        title="Category not found"
                        description="The category you're looking for doesn't exist."
                        icon={<BookOpen className="h-12 w-12" />}
                    />
                </Panel>
            </LearningSurface>
        );
    }

    const courses = coursesData?.data ?? [];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                eyebrow="Category"
                title={category.name}
                description={category.description || undefined}
            />

            {coursesLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <Panel>
                    <EmptyState
                        title="No courses in this category"
                        description="Check back later for new courses."
                        icon={<BookOpen className="h-12 w-12" />}
                    />
                </Panel>
            ) : (
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <li key={course.courseId}>
                            <Panel className="flex h-full flex-col overflow-hidden">
                                <div className="aspect-video w-full overflow-hidden border-b border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)]">
                                    {course.thumbnail ? (
                                        <SecureImage
                                            src={course.thumbnail}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <BookOpen
                                                aria-hidden="true"
                                                className="h-8 w-8 text-[var(--ls-ink-quiet)]"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    <h2 className="line-clamp-2 text-sm font-semibold text-[var(--ls-ink)]">
                                        {course.title}
                                    </h2>
                                    <p className="line-clamp-2 text-sm text-[var(--ls-ink-quiet)]">
                                        {course.description}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                                        <span className="ls-nums font-medium text-[var(--ls-ink)]">
                                            {course.currency}{" "}
                                            {parseFloat(course.price).toFixed(2)}
                                        </span>
                                        <Link href={`/learner/courses/${course.courseId}`}>
                                            <Button variant="outline" size="sm">
                                                View Course
                                                <span className="sr-only"> {course.title}</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Panel>
                        </li>
                    ))}
                </ul>
            )}

            {coursesData?.pagination && coursesData.pagination.totalPages > 1 ? (
                <div className="mt-6">
                    <Pagination
                        currentPage={coursesData.pagination.page}
                        totalPages={coursesData.pagination.totalPages}
                        onPageChange={(newPage) => {
                            setPage(newPage);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    />
                </div>
            ) : null}
        </LearningSurface>
    );
}
