"use client";

import { use, useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageTransition } from "@/components/page-transition";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCourse,
  useUpdateCourse,
  useSubmitCourseForReview,
} from "@/features/courses/hooks/use-courses";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen as BookIcon } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { CourseLoading } from "@/components/ui/course-loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { FormField } from "@/components/ui/form-field";
import { FileUpload } from "@/components/ui/file-upload";
import { SecureImage } from "@/components/ui/secure-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseBuilder } from "@/features/courses/components/course-builder";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().min(1, "Currency is required"),
  thumbnail: z
    .string()
    .min(1)
    .optional()
    .or(z.literal(""))
    .transform((val) => val === "" ? undefined : val),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export default function CourseEditPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [mounted, setMounted] = useState(false);

  const { data: course, isLoading } = useCourse({ enabled: true, courseId });
  const { data: categories } = useCategories();
  const updateCourse = useUpdateCourse();
  const submitForReview = useSubmitCourseForReview();
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      currency: "USD",
      thumbnail: "",
      categoryId: "",
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description,
        price: parseFloat(course.price),
        currency: course.currency,
        thumbnail: course.thumbnail || "",
        categoryId: course.categoryId,
        status: course.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      });
    }
  }, [course, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!courseId) {
      toast.error("Course ID is missing. Please reload and try again.");
      return;
    }

    try {
      const slug = generateSlug(values.title);
      await updateCourse.mutateAsync({
        id: courseId,
        dto: {
          ...values,
          shortDescription: values.description,
          slug,
        },
      });
      router.push("/instructor/courses");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update course";
      toast.error(errorMessage);
    }
  }

  if (isLoading) {
    return <CourseLoading type="edit" />;
  }

  if (!course) {
    return (
      <PageLayout header="Course Not Found">
        <EmptyState
          title="Course not found"
          description="The course you're looking for doesn't exist."
          icon={<BookIcon className="h-12 w-12" />}
        />
      </PageLayout>
    );
  }

  return (
    <PageTransition>
      <PageLayout
        header={`Edit Course: ${course.title}`}
        subtitle="Course Management"
        description="Update your course details, curriculum, and settings."
        enableTransition={false}
        actions={<BackButton href="/instructor/courses" />}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{course.reviewStatus || "DRAFT"}</Badge>
            {course.status === "PUBLISHED" && (
              <Badge className="bg-green-500">Published</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={
                submitForReview.isPending ||
                course.reviewStatus === "PENDING_REVIEW"
              }
              onClick={async () => {
                if (!courseId) return;
                await submitForReview.mutateAsync(courseId);
              }}
              className="w-full sm:w-auto"
            >
              {submitForReview.isPending
                ? "Submitting..."
                : "Submit for Review"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Update your course information
                </CardDescription>
                {course.rejectionReason && (
                  <div className="mt-2 p-2 bg-destructive/10 text-destructive text-sm rounded-md">
                    <strong>Rejection Reason:</strong> {course.rejectionReason}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Hidden fields to ensure RHF tracks controlled selects */}
                  <input
                    type="hidden"
                    {...register("categoryId")}
                    value={watch("categoryId") || ""}
                  />
                  <input
                    type="hidden"
                    {...register("status")}
                    value={watch("status") || "DRAFT"}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Course title"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-xs text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Course description"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("price", { valueAsNumber: true })}
                      />
                      {errors.price && (
                        <p className="text-xs text-destructive">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        placeholder="USD"
                        {...register("currency")}
                      />
                      {errors.currency && (
                        <p className="text-xs text-destructive">
                          {errors.currency.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    {mounted ? (
                      <Select
                        value={watch("categoryId")}
                        onValueChange={(value) => setValue("categoryId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories && categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem
                                key={category.categoryId}
                                value={category.categoryId}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No categories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                    )}
                    {errors.categoryId && (
                      <p className="text-xs text-destructive">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={updateCourse.isPending}>
                      {updateCourse.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <CourseBuilder courseId={courseId} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Manage publication status and other settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Publication Status</Label>
                  {mounted ? (
                    <Select
                      value={watch("status") || "DRAFT"}
                      onValueChange={async (
                        value: "DRAFT" | "PUBLISHED" | "ARCHIVED"
                      ) => {
                        setValue("status", value);
                        await updateCourse.mutateAsync({
                          id: courseId,
                          dto: { status: value },
                        });
                        toast.success(`Status updated to ${value}`);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Note: Publishing a course will make it visible to students
                    immediately if approved.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </PageTransition>
  );
}
