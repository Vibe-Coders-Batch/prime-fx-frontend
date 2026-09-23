"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, BookOpen, CheckCircle, Play, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SecureImage } from "@/components/ui/secure-image";
import { SecureVideoPlayer } from "@/components/ui/secure-video-player";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { DataList } from "@/components/learning/data-list";
import { StatusPill } from "@/components/learning/status-pill";
import { sentenceCaseEnum } from "@/components/learning/format";
import {
    useApproveCourse,
    useCourse,
    useRejectCourse,
    useRequestCourseChanges,
} from "@/features/courses/hooks/use-courses";

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
        defaultValues: { reviewNotes: "", rejectionReason: "" },
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
            const message =
                error?.response?.data?.message || error?.message || "Failed to approve course";
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
            const message =
                error?.response?.data?.message || error?.message || "Failed to request changes";
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
            const message =
                error?.response?.data?.message || error?.message || "Failed to reject course";
            toast.error(message);
        }
    };

    if (isLoading) {
        return (
            <LearningSurface width="wide">
                <LearningPageHeader title="Loading..." />
            </LearningSurface>
        );
    }
    if (!course) {
        return (
            <LearningSurface width="wide">
                <LearningPageHeader title="Course not found" />
            </LearningSurface>
        );
    }

    return (
        <LearningSurface width="wide">
            <LearningPageHeader eyebrow="Course administration" title={`Review: ${course.title}`} />

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
                <aside
                    aria-label="Review actions"
                    className="mb-6 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:sticky lg:top-6"
                >
                    <Panel className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-base font-semibold text-[var(--ls-ink)]">
                                Review actions
                            </h2>
                            {course.reviewStatus ? (
                                <StatusPill tone="neutral">
                                    {sentenceCaseEnum(course.reviewStatus)}
                                </StatusPill>
                            ) : null}
                        </div>

                        <Form {...form}>
                            <Tabs defaultValue="approve" className="mt-4 w-full">
                                <TabsList className="grid h-auto w-full grid-cols-3">
                                    <TabsTrigger value="approve" className="py-2 text-xs sm:text-sm">
                                        <CheckCircle
                                            aria-hidden="true"
                                            className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
                                        />
                                        <span className="hidden sm:inline">Approve</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="changes" className="py-2 text-xs sm:text-sm">
                                        <AlertCircle
                                            aria-hidden="true"
                                            className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
                                        />
                                        <span className="hidden sm:inline">Changes</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="reject" className="py-2 text-xs sm:text-sm">
                                        <XCircle
                                            aria-hidden="true"
                                            className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
                                        />
                                        <span className="hidden sm:inline">Reject</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="approve" className="space-y-4 pt-4">
                                    <p className="text-sm text-[var(--ls-ink-quiet)]">
                                        Approve this course and make it live for students.
                                    </p>
                                    <FormField
                                        control={form.control}
                                        name="reviewNotes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes (internal)</FormLabel>
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
                                        className="w-full"
                                        onClick={form.handleSubmit(handleApprove)}
                                        disabled={approveMutation.isPending}
                                    >
                                        {approveMutation.isPending
                                            ? "Approving..."
                                            : "Approve & Publish"}
                                    </Button>
                                </TabsContent>

                                <TabsContent value="changes" className="space-y-4 pt-4">
                                    <p className="text-sm text-[var(--ls-ink-quiet)]">
                                        Request changes from the instructor.
                                    </p>
                                    <FormField
                                        control={form.control}
                                        name="reviewNotes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Feedback / instructions</FormLabel>
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
                                    <p className="text-sm text-[var(--ls-ink-quiet)]">
                                        Reject this course permanently (or until re-submission).
                                    </p>
                                    <FormField
                                        control={form.control}
                                        name="rejectionReason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rejection reason</FormLabel>
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
                    </Panel>
                </aside>

                <div className="space-y-6 lg:col-start-1 lg:row-start-1">
                    <section aria-labelledby="overview-heading" className="space-y-3">
                        <SectionHeading id="overview-heading" title="Course overview" />
                        <Panel className="p-5">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="h-32 w-full shrink-0 overflow-hidden rounded-md border border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)] sm:h-20 sm:w-32">
                                    {course.thumbnail ? (
                                        <SecureImage
                                            src={course.thumbnail}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <BookOpen
                                                aria-hidden="true"
                                                className="h-6 w-6 text-[var(--ls-ink-quiet)]"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-[var(--ls-ink)]">
                                        {course.title}
                                    </h3>
                                    <p className="line-clamp-2 text-sm text-[var(--ls-ink-quiet)]">
                                        {course.description}
                                    </p>
                                </div>
                            </div>

                            <DataList
                                className="mt-4 border-t border-[var(--ls-divider)] pt-3"
                                items={[
                                    {
                                        label: "Instructor",
                                        value: `${course.instructor?.firstName ?? ""} ${course.instructor?.lastName ?? ""} (${course.instructor?.email ?? "N/A"})`,
                                    },
                                    { label: "Category", value: course.category?.name ?? "N/A" },
                                    {
                                        label: "Price",
                                        value: `${course.currency} ${course.price}`,
                                    },
                                    {
                                        label: "Status",
                                        value: (
                                            <StatusPill
                                                tone={
                                                    course.status === "PUBLISHED" ? "ok" : "neutral"
                                                }
                                            >
                                                {sentenceCaseEnum(String(course.status))}
                                            </StatusPill>
                                        ),
                                    },
                                ]}
                            />
                        </Panel>
                    </section>

                    <section aria-labelledby="curriculum-heading" className="space-y-3">
                        <SectionHeading
                            id="curriculum-heading"
                            title="Curriculum preview"
                            description="Click on video lessons to preview them"
                        />
                        <Panel className="overflow-hidden">
                            <ol className="divide-y divide-[var(--ls-divider)]">
                                {(course.sections || []).map((section, idx) => (
                                    <li key={section.sectionId} className="p-4 sm:p-5">
                                        <h3 className="text-sm font-semibold text-[var(--ls-ink)]">
                                            <span className="ls-nums text-[var(--ls-ink-quiet)]">
                                                {idx + 1}.
                                            </span>{" "}
                                            {section.title}
                                        </h3>
                                        <ol className="mt-2 space-y-0.5">
                                            {section.lessons?.map((lesson, lIdx) => (
                                                <li
                                                    key={lesson.lessonId}
                                                    className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm"
                                                >
                                                    <span className="min-w-0 text-[var(--ls-ink-quiet)]">
                                                        <span className="ls-nums">{lIdx + 1}.</span>{" "}
                                                        {lesson.title} ({lesson.type})
                                                    </span>
                                                    {lesson.type === "VIDEO" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 shrink-0 px-2"
                                                            onClick={() =>
                                                                setPreviewVideo({
                                                                    lessonId: lesson.lessonId,
                                                                    title: lesson.title,
                                                                    sectionTitle: section.title,
                                                                })
                                                            }
                                                        >
                                                            <Play
                                                                aria-hidden="true"
                                                                className="mr-1 h-3 w-3"
                                                            />
                                                            Preview
                                                            <span className="sr-only">
                                                                {" "}
                                                                {lesson.title}
                                                            </span>
                                                        </Button>
                                                    ) : null}
                                                </li>
                                            ))}
                                        </ol>
                                    </li>
                                ))}
                            </ol>
                        </Panel>
                    </section>
                </div>
            </div>

            <Dialog
                open={!!previewVideo}
                onOpenChange={(open) => !open && setPreviewVideo(null)}
            >
                <DialogContent className="max-h-[90vh] max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{previewVideo?.title}</DialogTitle>
                        <DialogDescription>
                            {previewVideo?.sectionTitle} (admin preview only)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                        {previewVideo?.lessonId ? (
                            <SecureVideoPlayer lessonId={previewVideo.lessonId} showStatus />
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </LearningSurface>
    );
}
