"use client";
import { PageLayout } from "@/components/layout/page-layout";
import { Search, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useCourses } from "@/features/courses/hooks/use-courses";
import type { Course } from "@/features/courses/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CourseFilters } from "@/features/courses/types";
type StatusFilterValue = "all" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
import { useDebounce } from "@/hooks/use-debounce";
export default function AdminCourseManagementPage() {
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 20;
    useEffect(() => {
        setMounted(true);
    }, []);
    const getStatusFilter = (): CourseFilters["status"] => {
        if (statusFilter === "all")
            return undefined;
        return statusFilter;
    };
    const handleStatusFilterChange = (value: string) => {
        if (value === "all" ||
            value === "DRAFT" ||
            value === "PUBLISHED" ||
            value === "ARCHIVED") {
            setStatusFilter(value);
            setPage(1);
        }
    };
    const { data: coursesData, isLoading, isError, isFetching, } = useCourses({
        enabled: true,
        filters: {
            search: debouncedSearch || undefined,
            status: getStatusFilter(),
            categoryId: categoryFilter === "all" ? undefined : categoryFilter,
            page,
            limit,
        },
    });
    const totalPages = coursesData?.pagination?.totalPages || 1;
    const currentPage = coursesData?.pagination?.page || 1;
    return (<PageLayout header="Course Management" description="Manage all courses, approve content, and moderate course listings.">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none"/>
            <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 text-sm"/>
          </div>
          {mounted ? (<>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                  <SelectValue placeholder="All Status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                  <SelectValue placeholder="All Categories"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  
                </SelectContent>
              </Select>
            </>) : (<>
              <Skeleton className="w-full sm:w-[160px] h-9"/>
              <Skeleton className="w-full sm:w-[160px] h-9"/>
            </>)}
        </div>

        {isLoading && !isFetching ? (<div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (<Skeleton key={i} className="h-16"/>))}
          </div>) : isError ? (<EmptyState title="Error loading courses" description="There was a problem loading the courses. Please try again." illustration="/illustrations/no_data.svg"/>) : !coursesData?.data || coursesData.data.length === 0 ? (<EmptyState title="No courses found" description="Courses will appear here once instructors create them." illustration="/illustrations/no_data.svg"/>) : (<Card>
            <CardContent className="p-0">
              <div className={cn("overflow-x-auto", isFetching && "opacity-50 pointer-events-none")}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Title</TableHead>
                      <TableHead className="min-w-[120px] hidden md:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="min-w-[150px] hidden lg:table-cell">
                        Instructor
                      </TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">
                        Review Status
                      </TableHead>
                      <TableHead className="min-w-[100px] hidden sm:table-cell">
                        Price
                      </TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell">
                        Created
                      </TableHead>
                      <TableHead className="text-right min-w-[120px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coursesData.data.map((course) => (<TableRow key={course.courseId}>
                        <TableCell className="font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {course.category?.name || "N/A"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {course.instructor
                    ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim() || course.instructor.email
                    : "N/A"}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded ${course.status === "PUBLISHED"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : course.status === "DRAFT"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"}`}>
                            {course.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {course.reviewStatus && (<span className={cn("px-2 py-1 text-xs rounded border", course.reviewStatus === "PENDING_REVIEW"
                        ? "bg-orange-100 text-orange-800 border-orange-200"
                        : course.reviewStatus === "APPROVED"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-gray-50 text-gray-600 border-gray-200")}>
                              {course.reviewStatus.replace("_", " ")}
                            </span>)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {course.currency}{" "}
                          {parseFloat(course.price).toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <Link href={`/admin/courses/${course.courseId}`}>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                View
                              </Button>
                            </Link>
                            <Link href={`/admin/courses/${course.courseId}`}>
                              <Button variant="default" size="sm" className="w-full sm:w-auto">
                                Review
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {totalPages > 1 && (<div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isFetching}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isFetching}>
                    Next
                  </Button>
                </div>
              </div>)}
          </Card>)}
      </div>
    </PageLayout>);
}
