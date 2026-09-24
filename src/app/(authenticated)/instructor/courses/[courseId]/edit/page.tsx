"use client";
import { use, useState, useEffect } from "react";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { StatusPill } from "@/components/learning/status-pill";
import { sentenceCaseEnum } from "@/components/learning/format";
import { PageTransition } from "@/components/page-transition";
import { useCourse, useUpdateCourse, useSubmitCourseForReview, } from "@/features/courses/hooks/use-courses";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseBuilder } from "@/features/courses/components/course-builder";
import type { AxiosError } from "axios";
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    // Keep in sync with backend UpdateCourseDto (@MinLength(10))
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.preprocess((v) => (typeof v === "number" && !Number.isFinite(v) ? undefined : v), z.number().min(0, "Price must be positive")),
    compareAtPrice: z.preprocess((v) => (typeof v === "number" && !Number.isFinite(v) ? undefined : v), z.number().min(0, "Original price must be positive").optional()),
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
export default function CourseEditPage({ params, }: {
    params: Promise<{
        courseId: string;
    }>;
}) {
    const { courseId } = use(params);
    const [mounted, setMounted] = useState(false);
    const { data: course, isLoading } = useCourse({ enabled: true, courseId });
    const { data: categories } = useCategories();
    const updateCourse = useUpdateCourse();
    const submitForReview = useSubmitCourseForReview();
    const router = useRouter();
    useEffect(() => {
        setMounted(true);
    }, []);
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            compareAtPrice: undefined,
            currency: "AED",
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
                compareAtPrice: course.compareAtPrice ? parseFloat(String(course.compareAtPrice)) : undefined,
                currency: "AED",
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
            const dto: any = {
                ...values,
                currency: "AED",
                shortDescription: values.description,
                slug,
                // Ensure thumbnail is always sent so prod updates (upload or remove)
                thumbnail: values.thumbnail ?? null,
            };
            if (dto.compareAtPrice !== undefined && !Number.isFinite(dto.compareAtPrice)) {
                delete dto.compareAtPrice;
            }
            await updateCourse.mutateAsync({
                id: courseId,
                dto: {
                    ...dto,
                },
            });
            router.push("/instructor/courses");
        }
        catch (error: unknown) {
            const axiosError = error as AxiosError<any>;
            const serverMessage = (axiosError?.response?.data as any)?.message;
            const errorMessage = Array.isArray(serverMessage)
                ? serverMessage.join(", ")
                : typeof serverMessage === "string"
                    ? serverMessage
                    : error instanceof Error
                        ? error.message
                        : "Failed to update course";
            toast.error(errorMessage);
        }
    }
    if (isLoading) {
        return <CourseLoading type="edit"/>;
    }
    if (!course) {
        return (<LearningSurface width="wide">
        <LearningPageHeader title="Course not found"/>
        <Panel>
          <EmptyState title="Course not found" description="The course you're looking for doesn't exist." icon={<BookIcon className="h-12 w-12"/>}/>
        </Panel>
      </LearningSurface>);
    }
    return (<PageTransition>
      <LearningSurface width="wide">
        <LearningPageHeader eyebrow="Course management" title={`Edit course: ${course.title}`} description="Update your course details, curriculum, and settings." actions={<BackButton href="/instructor/courses"/>}/>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <StatusPill tone="neutral">{sentenceCaseEnum(course.reviewStatus || "DRAFT")}</StatusPill>
            {course.status === "PUBLISHED" && (<StatusPill tone="ok">Published</StatusPill>)}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={submitForReview.isPending ||
            course.reviewStatus === "PENDING_REVIEW"} onClick={async () => {
            if (!courseId)
                return;
            await submitForReview.mutateAsync(courseId);
        }} className="w-full sm:w-auto">
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
            <Panel className="p-5">
              <div className="mb-4 space-y-1">
                <h2 className="text-base font-semibold text-[var(--ls-ink)]">Course details</h2>
                <p className="text-sm text-[var(--ls-ink-quiet)]">
                  Update your course information
                </p>
                {course.rejectionReason && (<div className="mt-2 rounded-md border border-[var(--ls-divider)] bg-[var(--ls-risk-tint)] p-2 text-sm text-[var(--ls-risk)]">
                    <strong>Rejection reason:</strong> {course.rejectionReason}
                  </div>)}
              </div>
              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  <input type="hidden" {...register("categoryId")} value={watch("categoryId") || ""}/>
                  <input type="hidden" {...register("status")} value={watch("status") || "DRAFT"}/>
                  <input type="hidden" {...register("currency")} value="AED"/>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Course title" {...register("title")}/>
                    {errors.title && (<p className="text-xs text-destructive">
                        {errors.title.message}
                      </p>)}
                  </div>

                  <div className="space-y-2">
                    <Label>Course Thumbnail</Label>
                    <p className="text-xs text-[var(--ls-ink-quiet)]">
                      Upload or change the image shown for this course. This appears on the course card and detail page. Save changes to update it.
                    </p>
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 max-w-xl">
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-4 flex items-center justify-center min-h-[180px]">
                        {watch("thumbnail") ? (
                          <SecureImage src={watch("thumbnail")!} alt="Course thumbnail" className="w-full h-full object-cover"/>
                        ) : (
                          <span className="text-sm text-[var(--ls-ink-quiet)]">No thumbnail. Upload one below.</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <FileUpload
                          onUploadComplete={(key) => setValue("thumbnail", key, { shouldDirty: true })}
                          folder="thumbnails"
                          label="Upload or change image"
                          className="w-full"
                        />
                        {watch("thumbnail") && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("thumbnail", "", { shouldDirty: true })}
                          >
                            Remove thumbnail
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Course description" {...register("description")}/>
                    {errors.description && (<p className="text-xs text-destructive">
                        {errors.description.message}
                      </p>)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Final Price (AED)</Label>
                      <Input id="price" type="number" step="0.01" placeholder="0.00" {...register("price", { valueAsNumber: true })}/>
                      {errors.price && (<p className="text-xs text-destructive">
                          {errors.price.message}
                        </p>)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compareAtPrice">Original Price (AED) (optional)</Label>
                      <Input id="compareAtPrice" type="number" step="0.01" placeholder="0.00" {...register("compareAtPrice", { valueAsNumber: true })}/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    {mounted ? (<Select value={watch("categoryId")} onValueChange={(value) => setValue("categoryId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category"/>
                        </SelectTrigger>
                        <SelectContent>
                          {categories && categories.length > 0 ? (categories.map((category) => (<SelectItem key={category.categoryId} value={category.categoryId}>
                                {category.name}
                              </SelectItem>))) : (<SelectItem value="none" disabled>
                              No categories available
                            </SelectItem>)}
                        </SelectContent>
                      </Select>) : (<div className="h-10 w-full bg-muted animate-pulse rounded-md"/>)}
                    {errors.categoryId && (<p className="text-xs text-destructive">
                        {errors.categoryId.message}
                      </p>)}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={updateCourse.isPending}>
                      {updateCourse.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="curriculum">
            <CourseBuilder courseId={courseId}/>
          </TabsContent>

          <TabsContent value="settings">
            <Panel className="p-5">
              <div className="mb-4 space-y-1">
                <h2 className="text-base font-semibold text-[var(--ls-ink)]">Course settings</h2>
                <p className="text-sm text-[var(--ls-ink-quiet)]">
                  Manage publication status and other settings.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Publication Status</Label>
                  {mounted ? (<Select value={watch("status") || "DRAFT"} onValueChange={async (value: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
                setValue("status", value);
                await updateCourse.mutateAsync({
                    id: courseId,
                    dto: { status: value },
                });
                toast.success(`Status updated to ${value}`);
            }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>) : (<div className="h-10 w-full bg-muted animate-pulse rounded-md"/>)}
                  <p className="text-xs text-[var(--ls-ink-quiet)]">
                    Note: Publishing a course will make it visible to students
                    immediately if approved.
                  </p>
                </div>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
      </LearningSurface>
    </PageTransition>);
}
