"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useMemo, useState } from "react";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCarousel } from "@/components/ui/course-carousel";
import { CourseCarouselSkeleton } from "@/components/ui/course-carousel-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: coursesData, isLoading } = useCourses({
    enabled: true,
    filters: {
      search: search || undefined,
      categoryId: categoryFilter === "all" ? undefined : categoryFilter,
      status: "PUBLISHED",
      limit: 100, // Get more courses to show across categories
    },
  });

  const { data: enrollmentsData } = useEnrollments({
     enabled: true,
     filters: { limit: 1000 }
  });

  const enrolledCourseIds = useMemo(() => {
    return new Set(enrollmentsData?.data?.map(e => e.courseId) || []);
  }, [enrollmentsData?.data]);

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Group courses by category
  const coursesByCategory = useMemo(() => {
    if (!categories || !coursesData?.data) return [];
    
    // If a specific category is selected, show only that category
    if (categoryFilter !== "all") {
      const selectedCategory = categories.find(c => c.categoryId === categoryFilter);
      if (!selectedCategory) return [];
      
      const categoryCourses = coursesData.data.filter(
        course => course.categoryId === categoryFilter
      );
      
      return categoryCourses.length > 0 ? [{
        category: selectedCategory,
        courses: categoryCourses,
      }] : [];
    }
    
    // Show all categories with their courses
    return categories
      .map(category => {
        const categoryCourses = coursesData.data.filter(
          course => course.categoryId === category.categoryId
        );
        return {
          category,
          courses: categoryCourses,
        };
      })
      .filter(item => item.courses.length > 0); // Only show categories that have courses
  }, [categories, coursesData, categoryFilter]);

  return (
    <PageLayout
      header="Browse Courses"
      description="Discover our comprehensive collection of courses designed to enhance your skills and knowledge."
    >
      <div className="space-y-6">
        <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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

        {isLoading || categoriesLoading ? (
          <div className="space-y-8">
            <CourseCarouselSkeleton title="Loading..." />
            <CourseCarouselSkeleton title="Loading..." />
            <CourseCarouselSkeleton title="Loading..." />
          </div>
        ) : coursesByCategory.length === 0 ? (
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
        ) : (
          <div className="space-y-8">
            {coursesByCategory.map(({ category, courses }) => (
              <div key={category.categoryId}>
                <CourseCarousel
                  title={category.name}
                  courses={courses}
                  enrolledCourseIds={enrolledCourseIds}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
