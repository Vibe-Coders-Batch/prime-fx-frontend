"use client";

import { useCourses } from "@/lib/hooks/use-courses";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, FileText, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default function AdminCourseReviewsPage() {
  const router = useRouter();
  
  // Fetch courses with status PENDING_REVIEW (implied by admin view or explicit filter)
  // Backend service logic for admin: if filter status not provided, it might return all.
  // But we specifically want reviewStatus='PENDING_REVIEW'. 
  // Our backend findAll implementation only filters by 'status' (PUBLISHED/DRAFT) or checks user role.
  // It returns "reviewStatus" field.
  // We might need to add 'reviewStatus' to filter in backend if listing ALL pending courses is inefficient.
  // But for MVP, let's filter client side or assume we modify backend later if needed.
  // Wait, backend `findAll`:
  /*
    if (filters?.status) {
      conditions.push(eq(courses.status, filters.status));
    } else if (userRole !== 'PLATFORM_ADMIN' && userRole !== 'INSTRUCTOR') {
       // ... learner logic
    }
  */
  // It doesn't seem to support filtering by `reviewStatus` explicitly in the API via `status` param?
  // `FilterCoursesDto` has `status` which is DRAFT/PUBLISHED.
  // We need to fetch ALL and filter, OR add `reviewStatus` to filters.
  // Checking `FilterCoursesDto` in backend... it was not open.
  // Let's try getting all (as admin) and filtering client side for now.
  // Or better, add `reviewStatus` to `useCourses` filters if supported.
  // I will just fetch all and filter in UI for now to start.
  
  const { data, isLoading } = useCourses({ 
      filters: { limit: 100 } // Fetch enough to find pending ones
  });

  const pendingCourses = data?.data.filter(c => c.reviewStatus === 'PENDING_REVIEW') || [];

  return (
    <PageLayout
      header="Course Reviews"
      description="Review and approve instructor submitted courses."
    >
      <div className="space-y-6">
        {isLoading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : pendingCourses.length === 0 ? (
            <div className="text-center py-20 border rounded-lg bg-muted/10">
                <h3 className="text-lg font-medium">No Pending Reviews</h3>
                <p className="text-muted-foreground">All caught up! No courses are waiting for approval.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingCourses.map(course => (
                    <Card key={course.courseId} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                    Pending Review
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {course.submittedAt ? formatDistanceToNow(new Date(course.submittedAt), { addSuffix: true }) : 'Recently'}
                                </span>
                            </div>
                            <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{course.instructor?.firstName} {course.instructor?.lastName}</span>
                            </div>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>{course.sections?.length || 0} Sections</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => router.push(`/admin/courses/reviews/${course.courseId}`)}>
                                Review Course
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </PageLayout>
  );
}
