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
import Image from "next/image";

export function LandingPageClient() {
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>
      <Navbar />
      <div id="main-content">
        <Hero />
        <TrustStats />

        {/* Featured Courses Section */}
        <section
          className="py-16 bg-muted/50"
          aria-labelledby="featured-courses-heading"
        >
          <div className="container mx-auto px-4">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                id="featured-courses-heading"
                className="text-3xl font-bold mb-4"
              >
                Featured Courses
              </h2>
              <p className="text-muted-foreground">
                Discover our most popular courses designed to enhance your skills
              </p>
            </motion.header>
            {coursesLoading ? (
              <div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                role="list"
                aria-label="Loading courses"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64" aria-hidden="true" />
                ))}
              </div>
            ) : !featuredCourses?.data || featuredCourses.data.length === 0 ? (
              <div className="text-center py-12" role="status">
                <p className="text-muted-foreground">
                  No courses available yet. Check back soon!
                </p>
              </div>
            ) : (
              <motion.ul
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
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 list-none p-0"
                role="list"
                aria-label="Featured courses"
              >
                {featuredCourses.data.slice(0, 6).map((course) => (
                  <motion.li
                    key={course.courseId}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <article>
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none h-full flex flex-col">
                        {course.thumbnail && (
                          <figure className="aspect-video w-full overflow-hidden relative shrink-0 m-0">
                            <Image
                              src={course.thumbnail}
                              alt={`${course.title} course thumbnail`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-400 hover:scale-110"
                              loading="lazy"
                            />
                          </figure>
                        )}
                        <CardHeader className="flex-1">
                          <CardTitle className="line-clamp-2">
                            <h3>{course.title}</h3>
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {course.description}
                          </CardDescription>
                          {course.category && (
                            <p className="text-xs text-muted-foreground mt-2">
                              <span className="sr-only">Category: </span>
                              {course.category.name}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold">
                              <span className="sr-only">Price: </span>
                              {course.currency}{" "}
                              {parseFloat(course.price).toFixed(2)}
                            </span>
                            <Link
                              href={`/learner/courses/${course.courseId}`}
                              aria-label={`View details for ${course.title}`}
                            >
                              <Button variant="outline" size="sm">
                                View Course
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </article>
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <Link href="/learner/courses" aria-label="Browse all available courses">
                <Button variant="outline">View All Courses</Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        {categoriesLoading ? (
          <section className="py-16" aria-label="Loading categories">
            <div className="container mx-auto px-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32" aria-hidden="true" />
                ))}
              </div>
            </div>
          </section>
        ) : categories && categories.length > 0 ? (
          <section
            className="py-16"
            aria-labelledby="categories-heading"
          >
            <div className="container mx-auto px-4">
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2
                  id="categories-heading"
                  className="text-3xl font-bold mb-4"
                >
                  Browse by Category
                </h2>
                <p className="text-muted-foreground">
                  Explore courses organized by topic
                </p>
              </motion.header>
              <motion.ul
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
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 list-none p-0"
                role="list"
                aria-label="Course categories"
              >
                {categories.slice(0, 8).map((category) => (
                  <motion.li
                    key={category.categoryId}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      show: { opacity: 1, scale: 1 },
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={`/learner/categories/${category.slug}`}
                      aria-label={`Browse ${category.name} courses`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-none">
                        <CardHeader>
                          <CardTitle>
                            <h3>{category.name}</h3>
                          </CardTitle>
                          {category.description && (
                            <CardDescription className="line-clamp-2">
                              {category.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </section>
        ) : null}

        <Curriculum />
        <LiveEcosystem />
        <Toolkits />
        <About />
        <CTA />
      </div>
      <Footer />
    </main>
  );
}
