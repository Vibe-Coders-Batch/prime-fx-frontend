"use client";

import { BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useAuthStore } from "@/lib/store/auth-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/page-transition";
import { CourseCarousel } from "@/components/ui/course-carousel";
import { CourseCarouselSkeleton } from "@/components/ui/course-carousel-skeleton";
import { ContinueWatchingCarousel } from "@/components/ui/continue-watching-carousel";
import { HeroBanner } from "@/components/ui/hero-banner";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { useMemo } from "react";

export default function LearnerDashboardPage() {
  const { user } = useAuthStore();
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useEnrollments({
      enabled: true,
      filters: {
        userId: user?.id,
        limit: 100,
      },
    });

  const { data: allCourses, isLoading: coursesLoading } = useCourses({enabled: true, filters: { status: "PUBLISHED",  limit: 30,},});

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // ... (useMemos)



  const continueWatchingCourses = useMemo(() => {
    if (!enrollmentsData?.data || !allCourses?.data) return [];
    const publishedCoursesMap = new Map(
      allCourses.data.map((course) => [course.courseId, course])
    );
    return enrollmentsData.data
      .filter(
        (enrollment) => enrollment.status === "ACTIVE" && enrollment.courseId
      )
      .map((enrollment) => publishedCoursesMap.get(enrollment.courseId))
      .filter((course) => course !== undefined)
      .slice(0, 10);
  }, [enrollmentsData, allCourses]);

  const newReleasesCourses = useMemo(() => {
    if (!allCourses?.data) return [];
    return [...allCourses.data].slice(0, 10);
  }, [allCourses]);

  const featuredCourses = useMemo(() => {
    if (!allCourses?.data) return [];
    const courses = [...allCourses.data];
    const newReleasesIds = new Set(newReleasesCourses.map((c) => c.courseId));

    if (courses.length <= 10) {
      const different = courses.filter(
        (course) => !newReleasesIds.has(course.courseId)
      );
      if (different.length > 0) {
        return different.slice(0, 10);
      }
      return courses.slice().reverse().slice(0, 10);
    }

    const differentCourses = courses.filter(
      (course) => !newReleasesIds.has(course.courseId)
    );
    if (differentCourses.length >= 10) {
      return differentCourses.slice(0, 10);
    }

    return courses.slice(10, 20).length > 0
      ? courses.slice(10, 20)
      : courses
          .slice(5, 15)
          .filter((course) => !newReleasesIds.has(course.courseId));
  }, [allCourses, newReleasesCourses]);

  const featuredCourseForHero = useMemo(() => {
    return featuredCourses && featuredCourses.length > 0
      ? featuredCourses[0]
      : null;
  }, [featuredCourses]);

  const checkedHeroCourseId = featuredCourseForHero
    ? featuredCourseForHero.courseId
    : null;
  const { data: heroCourseDetails } = useCourse({ enabled: !!checkedHeroCourseId, courseId: checkedHeroCourseId ?? undefined });

  const categoryCarousels = useMemo(() => {
    if (!categories || categories.length === 0 || !allCourses?.data) return [];
    return categories.slice(0, 3).map((category) => {
      const categoryCourses = allCourses.data.filter(
        (c) => c.categoryId === category.categoryId
      );
      return {
        category,
        courses: categoryCourses.slice(0, 10),
        key: category.categoryId,
      };
    });
  }, [categories, allCourses]);

  const heroCourse = heroCourseDetails || featuredCourseForHero;

  if (coursesLoading || categoriesLoading) {
      return (
        <div className="space-y-6 px-4 sm:px-6 md:px-8 lg:px-12 py-8">
           {/* Hero Skeleton */}
           <div className="w-full aspect-[21/9] rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-muted animate-pulse" />
           </div>

           {/* Continue Watching Skeleton */}
           <CourseCarouselSkeleton title="Continue Watching" />
           
           {/* Featured Courses Skeleton */}
           <CourseCarouselSkeleton title="Featured Courses" />

           {/* New Releases Skeleton */}
           <CourseCarouselSkeleton title="New Releases" />
        </div>
      );
  }

  return (
    <PageTransition>
      <div className="space-y-0 relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 -z-10 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(224, 180, 88, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(224, 180, 88, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(224, 180, 88, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {heroCourse && (
          <motion.div
            className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HeroBanner course={heroCourse} />
          </motion.div>
        )}
        <div className="space-y-3 px-4 sm:px-6 md:px-8 lg:px-12 relative">
          {continueWatchingCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <ContinueWatchingCarousel courses={continueWatchingCourses} />
            </motion.div>
          )}

          {featuredCourses && featuredCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <CourseCarousel
                title={
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-5 w-5 text-primary" />
                    </motion.div>
                    Featured Courses
                  </motion.span>
                }
                courses={featuredCourses}
              />
            </motion.div>
          )}

          {newReleasesCourses && newReleasesCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <CourseCarousel
                title={
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </motion.div>
                    New Releases
                  </motion.span>
                }
                courses={newReleasesCourses}
              />
            </motion.div>
          )}

          {categoryCarousels.map(({ category, courses }, index) => {
            if (courses.length === 0) return null;
            return (
              <motion.div
                key={category.categoryId}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <CourseCarousel
                  title={`Popular in ${category.name}`}
                  courses={courses}
                />
              </motion.div>
            );
          })}

          {enrollmentsData?.data && enrollmentsData.data.length === 0 && !enrollmentsLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg border-none">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Start Your Learning Journey
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Explore our collection of courses and begin your path to
                    success
                  </p>
                  <Link href="/courses">
                    <Button size="lg" className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      Browse All Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
