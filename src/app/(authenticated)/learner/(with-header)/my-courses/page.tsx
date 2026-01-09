"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { BookOpen, CheckCircle, Search, Layers } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import { useAuthStore } from "@/lib/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { CourseCardSkeleton } from "@/components/cards/course-card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SecureImage } from "@/components/ui/secure-image";

export default function MyCoursesPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: enrollmentsData, isLoading } = useEnrollments({
    enabled: true,
    refetchOnMount: true,
    filters: {
      userId: user?.id,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit: 12,
    },
  });

  const pagination = enrollmentsData?.pagination;

  return (
    <PageLayout
      header="My Courses"
      description="Continue your learning journey with your enrolled courses."
    >
      <div className="space-y-4">
        <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 h-9 text-sm"
            />
          </div>
          {mounted ? (
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REVOKED">Revoked</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="w-full sm:w-[160px]">
              <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
            </div>
          )}
        </div>





        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-full">
                 <CourseCardSkeleton />
              </div>
            ))}
          </div>
        ) : !enrollmentsData?.data || enrollmentsData.data.length === 0 ? (
          <EmptyState
            title="No courses found"
            description={
              search
                ? "No courses match your search. Try different keywords."
                : "Start your learning journey by enrolling in a course."
            }
            icon={<BookOpen className="h-12 w-12" />}
            action={
              !search
                ? {
                    label: "Browse Courses",
                    onClick: () => (window.location.href = "/courses"),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrollmentsData.data
              .filter((enrollment) => {
                if (search) {
                  const courseTitle = enrollment.course?.title.toLowerCase() || "";
                  return courseTitle.includes(search.toLowerCase());
                }
                return true;
              })
              .map((enrollment) => (
              <Card
                key={enrollment.enrollmentId}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 relative">
                  {enrollment.course?.thumbnail ? (
                    <SecureImage
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course?.title || "Course thumbnail"}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  {enrollment.accessType === "SECTION" && (
                    <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      Partial Access
                    </div>
                  )}
                </div>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                      {enrollment.course?.title || "Unknown Course"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {enrollment.accessType === "SECTION" ? "Purchased on" : "Enrolled on"}{" "}
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Show accessed sections for partial access */}
                  {enrollment.accessType === "SECTION" && enrollment.accessedSections && enrollment.accessedSections.length > 0 && (
                    <div 
                      className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1.5 rounded"
                      title={`Sections: ${enrollment.accessedSections.map(s => s.title).join(', ')}`}
                    >
                      <span className="font-medium">Access to {enrollment.accessedSections.length} section{enrollment.accessedSections.length > 1 ? 's' : ''}:</span>
                      <ul className="mt-1 space-y-0.5 text-amber-700 dark:text-amber-300">
                        {enrollment.accessedSections.slice(0, 3).map((section) => (
                          <li key={section.sectionId} className="truncate">• {section.title}</li>
                        ))}
                        {enrollment.accessedSections.length > 3 && (
                          <li className="text-amber-500">+ {enrollment.accessedSections.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {enrollment.accessType !== "SECTION" && enrollment.course?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {enrollment.course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {enrollment.accessType === "SECTION" ? (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        Section Access
                      </span>
                    ) : (
                      <>
                        {enrollment.status === "ACTIVE" && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded">
                            In Progress
                          </span>
                        )}
                        {enrollment.status === "COMPLETED" && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {enrollment.status === "REVOKED" && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded">
                            Revoked
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <Link
                    href={`/learner/courses/${enrollment.courseId}/watch`}
                    className="block"
                  >
                    <Button
                      className="w-full"
                      variant={
                        enrollment.status === "COMPLETED"
                          ? "outline"
                          : "default"
                      }
                    >
                      {enrollment.accessType === "SECTION"
                        ? "Watch Section"
                        : enrollment.status === "COMPLETED"
                        ? "Review Course"
                        : "Resume Course"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages && pagination.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
