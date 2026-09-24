"use client";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useAuthStore } from "@/lib/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Video, BookOpen, ExternalLink, Edit, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { StatusPill, type StatusTone } from "@/components/learning/status-pill";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SecureVideoPlayer } from "@/components/ui/secure-video-player";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
interface VideoLesson {
    lessonId: string;
    title: string;
    description?: string;
    duration?: number;
    status: string;
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    sectionId: string;
    sectionTitle: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}
export default function InstructorVideosPage() {
    const { user } = useAuthStore();
    const [previewLessonId, setPreviewLessonId] = useState<string | null>(null);
    const { data: coursesData, isLoading } = useCourses({
        enabled: !!user?.id,
        filters: {
            instructorId: user?.id,
            limit: 100,
        },
    });
    const videoLessons = useMemo<VideoLesson[]>(() => {
        if (!coursesData?.data)
            return [];
        const videos: VideoLesson[] = [];
        coursesData.data.forEach((course) => {
            course.sections?.forEach((section) => {
                section.lessons?.forEach((lesson) => {
                    if (lesson.type === "VIDEO") {
                        videos.push({
                            lessonId: lesson.lessonId,
                            title: lesson.title,
                            description: lesson.description,
                            duration: lesson.duration,
                            status: lesson.status || "DRAFT",
                            courseId: course.courseId,
                            courseTitle: course.title,
                            courseSlug: course.slug,
                            sectionId: section.sectionId,
                            sectionTitle: section.title,
                            order: lesson.order,
                            createdAt: course.createdAt,
                            updatedAt: course.updatedAt,
                        });
                    }
                });
            });
        });
        return videos.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [coursesData]);
    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; tone: StatusTone }> = {
            READY: { label: "Ready", tone: "ok" },
            PROCESSING: { label: "Processing", tone: "accent" },
            DRAFT: { label: "Draft", tone: "neutral" },
            PENDING_APPROVAL: { label: "Pending", tone: "warn" },
        };
        const config = statusConfig[status] || statusConfig.DRAFT;
        return (
            <StatusPill tone={config.tone} className="bg-[var(--ls-paper)]/95">
                {config.label}
            </StatusPill>
        );
    };
    const formatDuration = (seconds?: number) => {
        if (!seconds)
            return "N/A";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };
    return (<LearningSurface width="wide">
      <LearningPageHeader eyebrow="Video management" title="My videos" description="View and manage all your uploaded video lessons."/>
      {isLoading ? (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (<Skeleton key={i} className="h-80 rounded-lg"/>))}
        </div>) : videoLessons.length === 0 ? (<Panel><EmptyState title="No videos yet" description="Upload your first video lesson to get started." icon={<Video className="h-12 w-12"/>} action={{
                label: "Create Course",
                onClick: () => (window.location.href = "/instructor/courses/new"),
            }}/></Panel>) : (<div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[var(--ls-ink)]">All videos</h2>
              <p className="ls-nums mt-1 text-sm text-[var(--ls-ink-quiet)]">
                {videoLessons.length} video
                {videoLessons.length !== 1 ? "s" : ""} across{" "}
                {new Set(videoLessons.map((v) => v.courseId)).size} course
                {new Set(videoLessons.map((v) => v.courseId)).size !== 1
                ? "s"
                : ""}
              </p>
            </div>
            <Link href="/instructor/courses/new">
              <Button className="w-full sm:w-auto">
                <BookOpen className="h-4 w-4 mr-2"/>
                <span className="hidden sm:inline">Create Course</span>
                <span className="sm:hidden">New Course</span>
              </Button>
            </Link>
          </div>

          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {videoLessons.map((video) => (<li key={video.lessonId}>
                <Panel className="flex flex-col h-full overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden border-b border-[var(--ls-divider)] relative bg-black">
                    {video.status === "READY" ? (<SecureVideoPlayer lessonId={video.lessonId} className="w-full h-full" autoPlay={false} showStatus={true}/>) : (<div className="w-full h-full flex flex-col items-center justify-center text-white">
                        <Video aria-hidden="true" className="h-12 w-12 mb-2 text-zinc-400"/>
                        <p className="text-sm text-zinc-400">
                          {video.status === "PROCESSING"
                        ? "Processing..."
                        : "Not Ready"}
                        </p>
                      </div>)}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(video.status)}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--ls-ink)]">
                      {video.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-[var(--ls-ink-quiet)]">
                      {video.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--ls-ink-quiet)]">
                      <BookOpen className="h-3 w-3"/>
                      <span className="line-clamp-1">{video.courseTitle}</span>
                    </div>
                    <div className="ls-nums flex items-center gap-4 text-xs text-[var(--ls-ink-quiet)]">
                      <span>Section: {video.sectionTitle}</span>
                      {video.duration && (<>
                          <span>•</span>
                          <span>{formatDuration(video.duration)}</span>
                        </>)}
                    </div>
                  </div>

                  <div className="mt-auto p-4 pt-0">
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <Button variant="outline" className="flex-1 min-w-[80px]" size="sm" onClick={() => {
                    setPreviewLessonId(video.lessonId);
                }} disabled={video.status !== "READY"}>
                        <Play className="h-4 w-4 sm:mr-2"/>
                        <span className="hidden sm:inline">Preview</span>
                      </Button>

                      <Link href={`/instructor/courses/${video.courseId}/edit`} className="flex-1 min-w-[80px]">
                        <Button variant="outline" className="w-full" size="sm">
                          <Edit className="h-4 w-4 sm:mr-2"/>
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </Link>

                      <Link href={`/courses/${video.courseSlug}`} target="_blank" className="flex-1 min-w-[80px]">
                        <Button variant="ghost" className="w-full" size="sm">
                          <ExternalLink className="h-4 w-4 sm:mr-2"/>
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Panel>
              </li>))}
          </ul>
        </div>)}

      
      <Dialog open={!!previewLessonId} onOpenChange={(open) => {
            if (!open)
                setPreviewLessonId(null);
        }}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {previewLessonId ? (videoLessons.find((v) => v.lessonId === previewLessonId)?.title || "Video Preview") : "Video Preview"}
            </DialogTitle>
            <DialogDescription>
              {previewLessonId ? (<>
                  {videoLessons.find((v) => v.lessonId === previewLessonId)?.courseTitle || ""} -{" "}
                  {videoLessons.find((v) => v.lessonId === previewLessonId)?.sectionTitle || ""}
                </>) : ("")}
            </DialogDescription>
          </DialogHeader>
          {previewLessonId && (<div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <SecureVideoPlayer key={previewLessonId} lessonId={previewLessonId} autoPlay={true} showStatus={true}/>
            </div>)}
        </DialogContent>
      </Dialog>
    </LearningSurface>);
}
