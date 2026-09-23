"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Eye, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { OpsList, ResultCount, type OpsColumn } from "@/components/learning/ops-list";
import { useApproveCourse, useCourses, useRejectCourse } from "@/features/courses/hooks/use-courses";
import type { Course } from "@/lib/api/services/courses";

export default function ContentModerationPage() {
    const [search, setSearch] = useState("");
    const [courseToApprove, setCourseToApprove] = useState<string | null>(null);
    const [courseToReject, setCourseToReject] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const { data: coursesData, isLoading } = useCourses({
        enabled: true,
        filters: { status: "DRAFT", limit: 100 },
    });
    const approveCourse = useApproveCourse();
    const rejectCourse = useRejectCourse();

    const handleApprove = async (courseId: string) => {
        try {
            await approveCourse.mutateAsync({ id: courseId, publish: true });
            setCourseToApprove(null);
            toast.success("Course approved successfully!");
        } catch (error: any) {
            const message =
                error?.response?.data?.message || error?.message || "Failed to approve course";
            toast.error(message);
        }
    };

    const handleReject = async (courseId: string) => {
        if (!rejectionReason.trim()) return;
        try {
            await rejectCourse.mutateAsync({ id: courseId, reason: rejectionReason });
            setCourseToReject(null);
            setRejectionReason("");
            toast.success("Course rejected successfully");
        } catch (error: any) {
            const message =
                error?.response?.data?.message || error?.message || "Failed to reject course";
            toast.error(message);
        }
    };

    const coursesArray = coursesData?.data || [];
    const filteredCourses = coursesArray.filter((course: Course) => {
        const isPending = course.reviewStatus === "PENDING_REVIEW";
        if (!isPending) return false;
        if (search) {
            return course.title.toLowerCase().includes(search.toLowerCase());
        }
        return true;
    });

    const columns: OpsColumn<Course>[] = [
        { key: "title", header: "Course title", primary: true, cell: (course) => course.title },
        {
            key: "category",
            header: "Category",
            secondary: true,
            cell: (course) => course.category?.name ?? "",
        },
        {
            key: "instructor",
            header: "Instructor",
            cell: (course) =>
                course.instructor
                    ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim() ||
                      course.instructor.email
                    : "N/A",
        },
        {
            key: "submitted",
            header: "Submitted",
            numeric: true,
            cell: (course) =>
                course.submittedAt ? new Date(course.submittedAt).toLocaleDateString() : "N/A",
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Content moderation"
                description="Review and moderate course content before publication."
            />

            <div className="space-y-4">
                <Panel className="p-4">
                    <div className="relative">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ls-ink-quiet)]"
                        />
                        <Input
                            aria-label="Search courses pending review"
                            placeholder="Search pending courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </Panel>

                <ResultCount
                    isLoading={isLoading}
                    total={filteredCourses.length}
                    shown={filteredCourses.length}
                    noun="course awaiting review"
                    plural="courses awaiting review"
                />

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No pending reviews"
                            description="There are no courses currently waiting for review."
                            icon={
                                <div className="relative h-40 w-40">
                                    <Image
                                        src="/illustrations/no_data.svg"
                                        alt=""
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            }
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption="Courses awaiting review"
                        columns={columns}
                        rows={filteredCourses}
                        getRowKey={(course) => course.courseId}
                        renderActions={(course) => (
                            <>
                                <Link href={`/learner/courses/${course.courseId}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye aria-hidden="true" className="h-4 w-4 sm:mr-1" />
                                        <span className="hidden sm:inline">Review</span>
                                        <span className="sr-only"> {course.title}</span>
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[var(--ls-ok)]"
                                    onClick={() => setCourseToApprove(course.courseId)}
                                    disabled={approveCourse.isPending}
                                >
                                    <CheckCircle aria-hidden="true" className="h-4 w-4 sm:mr-1" />
                                    <span className="hidden sm:inline">Approve</span>
                                    <span className="sr-only"> {course.title}</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[var(--ls-risk)]"
                                    onClick={() => {
                                        setCourseToReject(course.courseId);
                                        setRejectionReason("");
                                    }}
                                    disabled={rejectCourse.isPending}
                                >
                                    <XCircle aria-hidden="true" className="h-4 w-4 sm:mr-1" />
                                    <span className="hidden sm:inline">Reject</span>
                                    <span className="sr-only"> {course.title}</span>
                                </Button>
                            </>
                        )}
                    />
                )}
            </div>

            <AlertDialog
                open={!!courseToApprove}
                onOpenChange={(open) => !open && setCourseToApprove(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Course?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve and publish this course? It will become
                            visible to all students immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (courseToApprove) handleApprove(courseToApprove);
                            }}
                        >
                            Approve &amp; Publish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={!!courseToReject}
                onOpenChange={(open) => !open && setCourseToReject(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Course</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this course. The instructor will
                            see this feedback.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            aria-label="Reason for rejection"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., The audio quality in Module 2 is too low..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setCourseToReject(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (courseToReject) handleReject(courseToReject);
                            }}
                            disabled={rejectCourse.isPending || !rejectionReason.trim()}
                        >
                            {rejectCourse.isPending ? "Rejecting..." : "Reject Course"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LearningSurface>
    );
}
