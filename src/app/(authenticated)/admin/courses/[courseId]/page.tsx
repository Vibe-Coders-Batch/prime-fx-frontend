"use client";

import { use } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import {
  useCourse,
  useApproveCourse,
  useRejectCourse,
  useRequestCourseChanges,
} from "@/features/courses/hooks/use-courses";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SecureVideoPlayer } from "@/components/ui/secure-video-player";
import { toast } from "sonner";

const reviewSchema = z.object({
  reviewNotes: z.string().optional(),
  rejectionReason: z.string().min(1, "Rejection reason is required").optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function AdminCourseReviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const { data: course, isLoading } = useCourse({ enabled: true, courseId });
  const approveMutation = useApproveCourse();
  const rejectMutation = useRejectCourse();
  const requestChangesMutation = useRequestCourseChanges();
  const [previewVideo, setPreviewVideo] = useState<{
    lessonId: string;
    title: string;
    sectionTitle: string;
  } | null>(null);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewNotes: "",
      rejectionReason: "",
    },
  });

  const handleApprove = async (data: ReviewFormData) => {
    if (!course?.courseId) {
      toast.error("Course ID not found");
      return;
    }
    try {
      await approveMutation.mutateAsync({
        id: course.courseId,
        notes: data.reviewNotes,
        publish: true,
      });
      toast.success("Course approved successfully!");
      router.push("/admin/courses");
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to approve course";
      toast.error(message);
    }
  };

  const handleRequestChanges = async (data: ReviewFormData) => {
    if (!course?.courseId) {
      toast.error("Course ID not found");
      return;
    }
    try {
      await requestChangesMutation.mutateAsync({
        id: course.courseId,
        notes: data.reviewNotes,
      });
      toast.success("Changes requested successfully!");
      router.push("/admin/courses");
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to request changes";
      toast.error(message);
    }
  };

  const handleReject = async (data: ReviewFormData) => {
    if (!course?.courseId) {
      toast.error("Course ID not found");
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        id: course.courseId,
        reason: data.rejectionReason || "",
      });
      toast.success("Course rejected!");
      router.push("/admin/courses");
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to reject course";
      toast.error(message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <PageLayout
      header={`Review: ${course.title}`}
      subtitle="Course Administration"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Course Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 sm:h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg">{course.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {course.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block">
                    Instructor
                  </span>
                  <span className="font-medium">
                    {course.instructor?.firstName} {course.instructor?.lastName}{" "}
                    ({course.instructor?.email})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Category</span>
                  <span className="font-medium">{course.category?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Price</span>
                  <span className="font-medium">
                    {course.currency} {course.price}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Status</span>
                  <Badge
                    variant={
                      course.status === "PUBLISHED" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Curriculum Preview</CardTitle>
              <CardDescription>
                Click on video lessons to preview them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(course.sections || []).map((section, idx) => (
                  <div key={section.sectionId} className="border rounded p-3">
                    <div className="font-medium">
                      Section {idx + 1}: {section.title}
                    </div>
                    <div className="pl-4 mt-2 space-y-1 text-sm">
                      {section.lessons?.map((lesson, lIdx) => (
                        <div
                          key={lesson.lessonId}
                          className="flex items-center justify-between group"
                        >
                          <span className="text-muted-foreground">
                            {lIdx + 1}. {lesson.title} ({lesson.type})
                          </span>
                          {lesson.type === "VIDEO" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2"
                              onClick={() =>
                                setPreviewVideo({
                                  lessonId: lesson.lessonId,
                                  title: lesson.title,
                                  sectionTitle: section.title,
                                })
                              }
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>
                Current Status: <Badge>{course.reviewStatus}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <Tabs defaultValue="approve" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-auto">
                    <TabsTrigger value="approve" className="text-green-600 text-xs sm:text-sm py-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Approve</span>
                    </TabsTrigger>
                    <TabsTrigger value="changes" className="text-orange-500 text-xs sm:text-sm py-2">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Changes</span>
                    </TabsTrigger>
                    <TabsTrigger value="reject" className="text-red-500 text-xs sm:text-sm py-2">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Reject</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="approve" className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Approve this course and make it live for students.
                    </p>
                    <FormField
                      control={form.control}
                      name="reviewNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Internal)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Optional notes..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={form.handleSubmit(handleApprove)}
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending
                        ? "Approving..."
                        : "Approve & Publish"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="changes" className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Request changes from the instructor.
                    </p>
                    <FormField
                      control={form.control}
                      name="reviewNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback / Instructions</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="What needs to be fixed?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={form.handleSubmit(handleRequestChanges)}
                      disabled={requestChangesMutation.isPending}
                    >
                      Request Changes
                    </Button>
                  </TabsContent>

                  <TabsContent value="reject" className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Reject this course permanently (or until re-submission).
                    </p>
                    <FormField
                      control={form.control}
                      name="rejectionReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rejection Reason</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Why is this rejected?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={form.handleSubmit(handleReject)}
                      disabled={rejectMutation.isPending}
                    >
                      Reject Course
                    </Button>
                  </TabsContent>
                </Tabs>
              </Form>
            </CardContent>
          </Card>

        </div>
      </div>

      <Dialog open={!!previewVideo} onOpenChange={(open) => !open && setPreviewVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewVideo?.title}</DialogTitle>
            <DialogDescription>
              {previewVideo?.sectionTitle} - Admin Preview Only
            </DialogDescription>
          </DialogHeader>
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            {previewVideo?.lessonId && (
              <SecureVideoPlayer 
                lessonId={previewVideo.lessonId}
                showStatus={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
