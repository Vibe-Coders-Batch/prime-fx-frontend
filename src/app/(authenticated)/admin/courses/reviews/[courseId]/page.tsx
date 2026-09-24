"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertOctagon, CheckCircle, FileText, Loader2, RefreshCw, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SecureVideoPlayer } from "@/components/ui/secure-video-player";
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
} from "@/lib/hooks/use-courses";

export default function AdminCourseReviewDetailPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const router = useRouter();
    const { data: course, isLoading } = useCourse({ id: courseId });
    const approveMutation = useApproveCourse();
    const rejectMutation = useRejectCourse();
    const requestChangeMutation = useRequestCourseChanges();
    const [notes, setNotes] = useState("");

    if (isLoading) {
        return (
            <LearningSurface width="wide">
                <div className="flex justify-center py-20">
                    <Loader2
                        aria-hidden="true"
                        className="h-8 w-8 animate-spin text-[var(--ls-ink-quiet)]"
                    />
                </div>
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

    const handleApprove = async () => {
        if (!course?.courseId) {
            toast.error("Course ID not found");
            return;
        }
        try {
            await approveMutation.mutateAsync({ id: course.courseId, publish: true });
            toast.success("Course approved and published");
            router.push("/admin/courses/reviews");
        } catch (error: any) {
            const message =
                error?.response?.data?.message || error?.message || "Failed to approve course";
            toast.error(message);
        }
    };

    const handleReject = async () => {
        if (!notes) return toast.error("Please provide a rejection reason");
        if (!course?.courseId) {
            toast.error("Course ID not found");
            return;
        }
        try {
            await rejectMutation.mutateAsync({ id: course.courseId, reason: notes });
            toast.success("Course rejected");
            router.push("/admin/courses/reviews");
        } catch (error: any) {
            const message =
                error?.response?.data?.message || error?.message || "Failed to reject course";
            toast.error(message);
        }
    };

    const handleRequestChanges = async () => {
        if (!notes) return toast.error("Please provide feedback notes");
        if (!course?.courseId) {
            toast.error("Course ID not found");
            return;
        }
        try {
            await requestChangeMutation.mutateAsync({ id: course.courseId, notes });
            toast.success("Changes requested");
            router.push("/admin/courses/reviews");
        } catch (error: any) {
            const message =
                error?.response?.data?.message || error?.message || "Failed to request changes";
            toast.error(message);
        }
    };

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                eyebrow="Course review"
                title={course.title}
                description={`Reviewing submission by ${course.instructor?.firstName} ${course.instructor?.lastName}`}
            />

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
                {/* Decision panel: read first on narrow screens. */}
                <aside
                    aria-label="Review actions"
                    className="mb-6 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:sticky lg:top-6"
                >
                    <Panel className="p-5">
                        <h2 className="text-base font-semibold text-[var(--ls-ink)]">
                            Review actions
                        </h2>
                        <p className="mt-0.5 text-sm text-[var(--ls-ink-quiet)]">
                            Make a decision on this submission.
                        </p>

                        <div className="mt-4 space-y-2">
                            <Label htmlFor="review-notes">Review notes / rejection reason</Label>
                            <Textarea
                                id="review-notes"
                                placeholder="Add feedback for the instructor..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={5}
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <Button className="w-full" onClick={handleApprove}>
                                <CheckCircle aria-hidden="true" className="mr-2 h-4 w-4" />
                                Approve &amp; Publish
                            </Button>

                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleRequestChanges}
                            >
                                <RefreshCw aria-hidden="true" className="mr-2 h-4 w-4" />
                                Request Changes
                            </Button>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full" variant="destructive">
                                        <AlertOctagon aria-hidden="true" className="mr-2 h-4 w-4" />
                                        Reject Course
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Reject Course?</DialogTitle>
                                        <DialogDescription>
                                            This will mark the course as rejected. The instructor
                                            will have to start over or contact support. Use
                                            &quot;Request Changes&quot; if you just want edits.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        {/* Was a bare button with no handler, so it never
                                            closed the dialog. */}
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="destructive" onClick={handleReject}>
                                            Confirm Reject
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </Panel>
                </aside>

                <div className="space-y-6 lg:col-start-1 lg:row-start-1">
                    <section aria-labelledby="content-heading" className="space-y-3">
                        <SectionHeading
                            id="content-heading"
                            title="Course content"
                            description="Review all sections and lessons. Click video lessons to watch."
                        />
                        <Panel className="p-4 sm:p-5">
                            <Accordion type="single" collapsible className="w-full">
                                {course.sections?.map((section) => (
                                    <AccordionItem
                                        key={section.sectionId}
                                        value={section.sectionId}
                                    >
                                        <AccordionTrigger>{section.title}</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-2 pt-2">
                                                {section.lessons?.map((lesson) => (
                                                    <li
                                                        key={lesson.lessonId}
                                                        className="rounded-md border border-[var(--ls-divider)] p-3"
                                                    >
                                                        <div className="mb-2 flex items-center justify-between gap-3">
                                                            <span className="flex items-center gap-2 text-sm font-medium text-[var(--ls-ink)]">
                                                                {lesson.type === "VIDEO" ? (
                                                                    <VideoIcon
                                                                        aria-hidden="true"
                                                                        size={16}
                                                                    />
                                                                ) : (
                                                                    <FileText
                                                                        aria-hidden="true"
                                                                        size={16}
                                                                    />
                                                                )}
                                                                {lesson.title}
                                                            </span>
                                                            <StatusPill tone="neutral">
                                                                {sentenceCaseEnum(
                                                                    String(lesson.type),
                                                                )}
                                                            </StatusPill>
                                                        </div>

                                                        {lesson.type === "VIDEO" ? (
                                                            <div className="mt-2">
                                                                <SecureVideoPlayer
                                                                    lessonId={lesson.lessonId}
                                                                    showStatus
                                                                />
                                                            </div>
                                                        ) : null}

                                                        {lesson.type === "TEXT" ? (
                                                            <div className="mt-2 max-h-40 overflow-y-auto rounded bg-[var(--ls-paper-quiet)] p-2 text-sm text-[var(--ls-ink)]">
                                                                {lesson.textContent}
                                                            </div>
                                                        ) : null}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Panel>
                    </section>

                    <section aria-labelledby="details-heading" className="space-y-3">
                        <SectionHeading id="details-heading" title="Course details" />
                        <Panel className="p-5">
                            <p className="ls-measure mb-3 text-sm leading-relaxed text-[var(--ls-ink)]">
                                {course.description}
                            </p>
                            <DataList
                                items={[
                                    {
                                        label: "Price",
                                        value: `${course.price} ${course.currency}`,
                                    },
                                    {
                                        label: "Category",
                                        value: course.category?.name ?? "N/A",
                                    },
                                ]}
                            />
                        </Panel>
                    </section>
                </div>
            </div>
        </LearningSurface>
    );
}
