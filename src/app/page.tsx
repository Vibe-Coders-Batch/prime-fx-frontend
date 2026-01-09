"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { TrustStats } from "@/components/sections/trust-stats";
import { About } from "@/components/sections/about";
import { Curriculum } from "@/components/sections/curriculum";
import { LiveEcosystem } from "@/components/sections/live-ecosystem";
import { Toolkits } from "@/components/sections/toolkits";
import { CTA } from "@/components/sections/cta";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LandingPageSkeleton } from "@/components/ui/landing-page-skeleton";
import { motion } from "framer-motion";

export default function Home() {
  const { data: featuredCourses, isLoading: coursesLoading } = useCourses({
    enabled: true,
    filters: {
      status: "PUBLISHED",
      limit: 6,
    },
  });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const isLoading = coursesLoading || categoriesLoading;

  if (isLoading) {
    return <LandingPageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Hero />
      <TrustStats />

      {/* Featured Courses Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
            <p className="text-muted-foreground">
              Discover our most popular courses designed to enhance your skills
            </p>
          </motion.div>
          {coursesLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>

          ) : !featuredCourses?.data || featuredCourses.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No courses available yet. Check back soon!
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {featuredCourses.data.slice(0, 6).map((course) => (
                <motion.div
                  key={course.courseId}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none h-full flex flex-col">
                    {course.thumbnail && (
                      <div className="aspect-video w-full overflow-hidden relative shrink-0">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <CardTitle className="line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                      {course.category && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {course.category.name}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          {course.currency}{" "}
                          {parseFloat(course.price).toFixed(2)}
                        </span>
                        <Link href={`/learner/courses/${course.courseId}`}>
                          <Button variant="outline" size="sm">
                            View Course
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Link href="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      {categoriesLoading ? (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </section>
      ) : categories && categories.length > 0 ? (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">
                Explore courses organized by topic
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {categories.slice(0, 8).map((category) => (
                <motion.div
                  key={category.categoryId}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    show: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/categories/${category.slug}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-none">
                      <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                        {category.description && (
                          <CardDescription className="line-clamp-2">
                            {category.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : null}

      <Curriculum />
      <LiveEcosystem />
      <Toolkits />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}
