"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { TrustStats } from "@/components/sections/trust-stats";
import { CTA } from "@/components/sections/cta";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useMemo, useState } from "react";
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
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Compass,
  GraduationCap,
  Layers,
  LineChart,
  MonitorSmartphone,
  Users,
  Wand2,
} from "lucide-react";

const TOPIC_TABS = [
  {
    id: "ai",
    label: "Artificial Intelligence (AI)",
    keywords: ["ai", "artificial intelligence", "machine learning", "genai"],
  },
  { id: "python", label: "Python", keywords: ["python"] },
  { id: "excel", label: "Microsoft Excel", keywords: ["excel"] },
  { id: "agents", label: "AI Agents & Agentic AI", keywords: ["agent", "agents"] },
  { id: "marketing", label: "Digital Marketing", keywords: ["marketing"] },
  { id: "aws", label: "Amazon AWS", keywords: ["aws", "cloud"] },
];

export function LandingPageClient() {
  const { data: featuredCourses, isLoading: coursesLoading } = useCourses({
    enabled: true,
    filters: {
      status: "PUBLISHED",
      limit: 6,
    },
  });

  const isLoading = coursesLoading;
  const [activeTopicId, setActiveTopicId] = useState(TOPIC_TABS[0]?.id ?? "ai");

  const activeTopic = TOPIC_TABS.find((t) => t.id === activeTopicId) ?? TOPIC_TABS[0];
  const topicCourses = useMemo(() => {
    const list = featuredCourses?.data ?? [];
    const keywords = (activeTopic?.keywords ?? []).map((k) => k.toLowerCase());
    const matches = list.filter((course) => {
      const haystack = `${course.title ?? ""} ${course.description ?? ""} ${course.category?.name ?? ""}`.toLowerCase();
      return keywords.some((k) => haystack.includes(k));
    });
    return (matches.length > 0 ? matches : list).slice(0, 8);
  }, [activeTopic?.keywords, featuredCourses?.data]);

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

        {/* Udemy-style topics + carousel */}
        <section className="py-16" aria-labelledby="skills-to-transform-heading">
          <div className="container mx-auto px-4">
            <header className="max-w-4xl">
              <h2 id="skills-to-transform-heading" className="text-3xl font-bold">
                Skills to transform your career and life
              </h2>
              <p className="mt-2 text-muted-foreground">
                From critical skills to technical topics, PRIME E-Learning & Training supports your professional development.
              </p>
            </header>

            <div className="mt-8">
              <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide border-b border-border pb-2">
                {TOPIC_TABS.map((tab) => {
                  const isActive = tab.id === activeTopicId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTopicId(tab.id)}
                      className={[
                        "whitespace-nowrap text-sm font-semibold pb-2 transition-colors",
                        isActive ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {topicCourses.length === 0 ? (
                    <div className="w-full">
                      <p className="text-muted-foreground">No courses available yet. Check back soon!</p>
                    </div>
                  ) : (
                    topicCourses.map((course) => (
                      <div key={course.courseId} className="min-w-[280px] max-w-[280px]">
                        <Card className="overflow-hidden border-border/60 hover:shadow-lg transition-shadow">
                          {course.thumbnail && (
                            <div className="relative aspect-video w-full">
                              <Image
                                src={course.thumbnail}
                                alt={`${course.title} course thumbnail`}
                                fill
                                className="object-cover"
                                sizes="280px"
                              />
                            </div>
                          )}
                          <CardHeader className="space-y-2">
                            <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                            <CardDescription className="text-xs line-clamp-2">
                              {course.description}
                            </CardDescription>
                            <div className="text-sm font-semibold">
                              {course.currency} {parseFloat(course.price).toFixed(2)}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Link href={`/learner/courses/${course.courseId}`} aria-label={`View ${course.title}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                View Course
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6">
                  <Link href="/learner/courses" className="text-sm font-semibold text-primary hover:underline">
                    Show all {activeTopic?.label ?? "selected"} courses →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Prime Learning */}
        <section
          id="why-prime-learning"
          className="py-16"
          aria-labelledby="why-prime-learning-heading"
        >
          <div className="container mx-auto px-4">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <h2
                id="why-prime-learning-heading"
                className="text-3xl font-bold mb-4"
              >
                A Modern Learning Platform Built for Results
              </h2>
              <p className="text-muted-foreground">
                PRIME E-Learning & Training is a premium, outcomes-driven learning ecosystem that
                blends academic rigor with practical application. Every course is
                designed to deliver skills you can use immediately.
              </p>
            </motion.header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Users className="h-5 w-5" />,
                  title: "Expert Led Courses",
                  description:
                    "Learn from experienced industry professionals and academic specialists.",
                },
                {
                  icon: <MonitorSmartphone className="h-5 w-5" />,
                  title: "Flexible Learning",
                  description:
                    "Study at your own pace on desktop, tablet, or mobile.",
                },
                {
                  icon: <BriefcaseBusiness className="h-5 w-5" />,
                  title: "Real World Skills",
                  description:
                    "Courses focused on practical, job-relevant outcomes.",
                },
                {
                  icon: <Award className="h-5 w-5" />,
                  title: "Certificates & Progress",
                  description:
                    "Track your learning journey and earn credible certificates.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-border/60">
                  <CardHeader>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section
          id="categories"
          className="py-16 bg-muted/50"
          aria-labelledby="categories-heading"
        >
          <div className="container mx-auto px-4">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <h2 id="categories-heading" className="text-3xl font-bold mb-4">
                Explore Learning Categories
              </h2>
              <p className="text-muted-foreground">
                Discover courses across high-demand domains. New categories and
                programs are added regularly.
              </p>
            </motion.header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Compass className="h-5 w-5" />,
                  title: "Business and Leadership",
                  description:
                    "Strategy, management, entrepreneurship, and leadership development.",
                },
                {
                  icon: <Layers className="h-5 w-5" />,
                  title: "Technology and Data",
                  description:
                    "Programming, artificial intelligence, data analytics, cloud, and cybersecurity.",
                },
                {
                  icon: <LineChart className="h-5 w-5" />,
                  title: "Finance and Markets",
                  description:
                    "Financial literacy, trading, investment fundamentals, and global markets.",
                },
                {
                  icon: <Wand2 className="h-5 w-5" />,
                  title: "Creative and Design",
                  description:
                    "UX UI, visual design, branding, content creation, and storytelling.",
                },
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  title: "Professional Skills",
                  description:
                    "Communication, project management, productivity, and decision making.",
                },
                {
                  icon: <GraduationCap className="h-5 w-5" />,
                  title: "Academic and Test Preparation",
                  description:
                    "Foundational subjects and exam readiness programs.",
                },
                {
                  icon: <Users className="h-5 w-5" />,
                  title: "Business School Admissions & Career Pathways",
                  description:
                    "MBA and MiM strategy, essays, interviews, research, and career planning.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-border/60">
                  <CardHeader>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/learner/courses" aria-label="Explore all categories">
                <Button variant="outline">Explore All Categories</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Designed for learners */}
        <section className="py-16" aria-labelledby="designed-for-results-heading">
          <div className="container mx-auto px-4">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <h2 id="designed-for-results-heading" className="text-3xl font-bold mb-4">
                Designed for Learners Who Want Results
              </h2>
              <p className="text-muted-foreground">
                PRIME E-Learning & Training is built to support every stage of your growth.
              </p>
            </motion.header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Personalised Learning Paths",
                  description:
                    "Choose courses aligned with your goals and experience level.",
                },
                {
                  title: "Interactive Learning Experience",
                  description:
                    "Videos, quizzes, projects, and case-based learning.",
                },
                {
                  title: "Mentor Support and Community",
                  description:
                    "Connect with instructors and fellow learners.",
                },
                {
                  title: "Mobile Ready and On Demand",
                  description:
                    "Access your courses anytime, anywhere.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section
          id="courses"
          className="py-16 bg-muted/50"
          aria-labelledby="popular-courses-heading"
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
                id="popular-courses-heading"
                className="text-3xl font-bold mb-4"
              >
                Popular and New Courses
              </h2>
              <p className="text-muted-foreground">
                Explore some of our most in-demand programs.
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
                aria-label="Popular and new courses"
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
                            {course.title}
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

        {/* Plans (Udemy-style) */}
        <section className="py-16" aria-labelledby="plans-heading">
          <div className="container mx-auto px-4">
            <header className="max-w-4xl">
              <h2 id="plans-heading" className="text-3xl font-bold">
                Grow your team&apos;s skills and your business
              </h2>
              <p className="mt-2 text-muted-foreground">
                Reach goals faster with one of our plans or programs. Try one free today or contact sales to learn more.
              </p>
            </header>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <Card className="border-border/60 overflow-hidden">
                <div className="h-1 w-full bg-primary" />
                <CardHeader>
                  <CardTitle>Team Plan</CardTitle>
                  <CardDescription>2 to 50 people — For your team</CardDescription>
                  <Button variant="outline" className="w-fit">
                    Start subscription
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold">From $X / month per user</p>
                    <p className="text-sm text-muted-foreground">Billed annually. Cancel anytime.</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Access to top courses",
                      "Certification prep",
                      "Goal-focused recommendations",
                      "AI-powered coaching",
                      "Analytics and adoption reports",
                    ].map((t) => (
                      <li key={t} className="flex gap-2">
                        <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/60 overflow-hidden">
                <div className="h-1 w-full bg-secondary" />
                <CardHeader>
                  <CardTitle>Enterprise Plan</CardTitle>
                  <CardDescription>More than 20 people — For your organisation</CardDescription>
                  <Button variant="outline" className="w-fit">
                    Request a demo
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-semibold">Contact sales for pricing</p>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Access to course library",
                      "Certification prep",
                      "Goal-focused recommendations",
                      "AI-powered coaching",
                      "Advanced analytics and insights",
                      "Dedicated customer success team",
                      "International course collection",
                      "Customisable content",
                    ].map((t) => (
                      <li key={t} className="flex gap-2">
                        <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/60 overflow-hidden">
                <div className="h-1 w-full bg-foreground/80" />
                <CardHeader>
                  <CardTitle>AI Fluency</CardTitle>
                  <CardDescription>From AI foundations to transformation</CardDescription>
                  <Button variant="outline" className="w-fit">
                    Contact Us
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="font-semibold">AI Readiness Collection</p>
                    <p className="text-sm text-muted-foreground">
                      Build organisation-wide AI fluency fast with curated courses and guided learning.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">AI Growth Collection</p>
                    <p className="text-sm text-muted-foreground">
                      Scale AI and technical expertise with specialised courses and role-based learning paths.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular skills */}
        <section className="py-16 bg-muted/50" aria-labelledby="popular-skills-heading">
          <div className="container mx-auto px-4">
            <h2 id="popular-skills-heading" className="text-3xl font-bold">
              Popular Skills
            </h2>

            <div className="mt-8 grid gap-8 lg:grid-cols-4">
              <Card className="border-border/60 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Trending skills</CardTitle>
                  <CardDescription>
                    Explore courses across in-demand skills and career pathways.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/learner/courses" className="text-sm font-semibold text-primary hover:underline">
                    See trending skills →
                  </Link>
                  <Link href="/learner/courses">
                    <Button variant="outline" className="w-full">
                      Show all trending skills
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <div className="lg:col-span-3 grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Development",
                    items: ["Python", "Web Development", "Data Science"],
                  },
                  {
                    title: "Design",
                    items: ["UX Design", "Graphic Design", "Product Design"],
                  },
                  {
                    title: "Business",
                    items: ["Project Management", "Business Strategy", "Power BI"],
                  },
                ].map((col) => (
                  <Card key={col.title} className="border-border/60">
                    <CardHeader>
                      <CardTitle className="text-lg">{col.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {col.items.map((item) => (
                        <Link
                          key={item}
                          href="/learner/courses"
                          className="block text-sm font-semibold text-primary hover:underline"
                        >
                          {item} →
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16" aria-labelledby="how-it-works-heading">
          <div className="container mx-auto px-4">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <h2 id="how-it-works-heading" className="text-3xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground">Getting started is simple.</p>
            </motion.header>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Browse Courses",
                  description: "Explore categories and select a course.",
                },
                {
                  step: "2",
                  title: "Enroll and Learn",
                  description: "Access high-quality lessons and resources.",
                },
                {
                  step: "3",
                  title: "Earn Your Certificate",
                  description: "Complete the course and showcase your achievement.",
                },
              ].map((item) => (
                <Card key={item.step} className="border-border/60">
                  <CardHeader>
                    <p className="text-sm font-semibold text-primary">Step {item.step}</p>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/signup" aria-label="Get started with PRIME E-Learning & Training">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Who we serve */}
        <section className="py-16 bg-muted/50" aria-labelledby="who-we-serve-heading">
          <div className="container mx-auto px-4">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <h2 id="who-we-serve-heading" className="text-3xl font-bold mb-4">
                Who We Serve
              </h2>
              <p className="text-muted-foreground">
                PRIME E-Learning & Training supports individuals and organisations.
              </p>
            </motion.header>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Students and Graduates",
                  description: "Build strong foundations and career readiness.",
                },
                {
                  title: "Working Professionals",
                  description: "Upskill or reskill for career growth.",
                },
                {
                  title: "Organisations and Teams",
                  description: "Train and develop your workforce.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials placeholder */}
        <section className="py-16" aria-labelledby="testimonials-heading">
          <div className="container mx-auto px-4">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 max-w-3xl mx-auto"
            >
              <h2 id="testimonials-heading" className="text-3xl font-bold mb-4">
                What Learners Say
              </h2>
              <p className="text-muted-foreground">
                Once testimonials are available, this section can showcase learner feedback,
                ratings, and outcomes.
              </p>
            </motion.header>
            <Card className="max-w-3xl mx-auto border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Testimonials coming soon</CardTitle>
                <CardDescription>
                  We’ll feature real stories from learners as the community grows.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <CTA />
      </div>
      <Footer />
    </main>
  );
}
