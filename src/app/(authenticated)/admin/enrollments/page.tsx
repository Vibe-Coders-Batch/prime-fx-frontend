"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { EmptyState } from "@/components/ui/empty-state";
import { UserCheck } from "lucide-react";
import { useEnrollments } from "@/features/enrollments/hooks/use-enrollments";
import type { Enrollment } from "@/features/enrollments/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

import { EditEnrollmentDialog } from "@/features/enrollments/components/edit-enrollment-dialog";

export default function EnrollmentManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: enrollmentsData, isLoading, isFetching } = useEnrollments({
    enabled: true,
    filters: {
      status: statusFilter === "all" ? undefined : statusFilter,
      search: debouncedSearch || undefined,
      page,
      limit,
    },
  });

  const handleEditClick = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setIsEditOpen(true);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to page 1 when filter changes
  };

  const totalPages = enrollmentsData?.pagination?.totalPages || 1;
  const currentPage = enrollmentsData?.pagination?.page || 1;

  return (
    <PageLayout
      header="Enrollment Management"
      description="View and manage all course enrollments across the platform."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search enrollments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              {mounted ? (
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REVOKED">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </div>
          </CardContent>
        </Card>

        {isLoading && !isFetching ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : !enrollmentsData?.data || enrollmentsData.data.length === 0 ? (
          <EmptyState
            title="No enrollments found"
            description="Enrollments will appear here once users enroll in courses."
            illustration="/illustrations/focused.svg"
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className={cn("overflow-x-auto", isFetching && "opacity-50 pointer-events-none")}>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollmentsData.data.map((enrollment: Enrollment) => (
                    <TableRow key={enrollment.enrollmentId}>
                      <TableCell>
                        {enrollment.user
                          ? `${enrollment.user.firstName || ""} ${
                              enrollment.user.lastName || ""
                            }`.trim() || enrollment.user.email
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {enrollment.course?.title || "Unknown Course"}
                      </TableCell>
                      <TableCell>{enrollment.company?.name || "N/A"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            enrollment.status === "ACTIVE"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                              : enrollment.status === "COMPLETED"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(enrollment)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isFetching}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isFetching}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        <EditEnrollmentDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          enrollment={editingEnrollment}
        />
      </div>
    </PageLayout>
  );
}
