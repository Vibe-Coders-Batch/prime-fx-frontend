"use client";
import { use } from "react";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), {
    ssr: false,
}) as any;
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { useCourseProgress, useUpdateProgress, } from "@/features/progress/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp, X, Menu, Check, Loader2, Lock, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { QuizPlayer } from "@/features/courses/components/quiz-player";
import { cn } from "@/lib/utils";
import { EnhancedVideoPlayer } from "@/components/ui/enhanced-video-player";
import { useLessonPlaybackUrl } from "@/features/lessons/hooks/use-lesson-playback";
import { useSaveVideoProgress } from "@/features/lessons/hooks/use-lesson-progress";
export default function CoursePlayerPage({ params, }: {
    params: Promise<{
        courseId: string;
    }>;
}) {
    const { courseId } = use(params);
    const { data: course, isLoading } = useCourse({ enabled: true, courseId });
    const { data: progress } = useCourseProgress({ enabled: true, courseId });
    const updateProgress = useUpdateProgress();
    const { user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const watchId = searchParams.get("watchId");
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useEffect(() => {
        if (watchId && watchId !== selectedLesson) {
            setSelectedLesson(watchId);
        }
    }, [watchId]);
    useEffect(() => {
        if (selectedLesson && courseId) {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("watchId", selectedLesson);
            router.replace(`/learner/courses/${courseId}/watch?${newParams.toString()}`, { scroll: false });
        }
    }, [selectedLesson, courseId, router]);
    useEffect(() => {
        if (course?.sections) {
            const allExpanded = new Set(course.sections.map((s) => s.sectionId));
            setExpandedModules(allExpanded);
        }
    }, [course?.sections]);
    const accessibleSectionIds = useMemo(() => {
        if (user?.role === "PLATFORM_ADMIN" || user?.role === "INSTRUCTOR") {
            return course?.sections?.map((s) => s.sectionId) || [];
        }
        if (course?.accessibleSectionIds) {
            return course.accessibleSectionIds;
        }
        return [];
    }, [course, user]);
    useEffect(() => {
        if (course?.sections &&
            course.sections.length > 0 &&
            accessibleSectionIds.length > 0 &&
            !selectedLesson) {
            const firstAccessibleSection = course.sections.find((section) => accessibleSectionIds.includes(section.sectionId));
            if (firstAccessibleSection && firstAccessibleSection.lessons?.length) {
                setSelectedLesson(firstAccessibleSection.lessons[0].lessonId);
            }
        }
    }, [course?.sections, accessibleSectionIds, selectedLesson]);
    const flatLessons = useMemo(() => {
        return course?.sections?.flatMap((s) => s.lessons || []) || [];
    }, [course]);
    const currentLessonIndex = flatLessons.findIndex((l) => l.lessonId === selectedLesson);
    const nextLesson = currentLessonIndex !== -1 && currentLessonIndex < flatLessons.length - 1
        ? flatLessons[currentLessonIndex + 1]
        : null;
    const prevLesson = currentLessonIndex > 0 ? flatLessons[currentLessonIndex - 1] : null;
    const handleNext = () => {
        if (nextLesson)
            setSelectedLesson(nextLesson.lessonId);
    };
    const handlePrev = () => {
        if (prevLesson)
            setSelectedLesson(prevLesson.lessonId);
    };
    const handleLessonComplete = async () => {
        if (selectedLesson) {
            await updateProgress.mutateAsync({
                courseId,
                dto: {
                    lessonId: selectedLesson || undefined,
                    completed: true,
                },
            });
        }
    };
    const currentLesson = flatLessons[currentLessonIndex];
    const isCurrentLessonAccessible = useMemo(() => {
        if (!currentLesson || !course?.sections)
            return false;
        return course.sections.some((s) => s.lessons?.some((l) => l.lessonId === currentLesson.lessonId) &&
            accessibleSectionIds.includes(s.sectionId));
    }, [currentLesson, course?.sections, accessibleSectionIds]);
    const { data: playbackData, isLoading: isLoadingPlayback, errorType: playbackErrorType, errorMessage: playbackErrorMessage, } = useLessonPlaybackUrl(currentLesson?.type === "VIDEO" &&
        currentLesson?.status === "READY" &&
        isCurrentLessonAccessible
        ? currentLesson.lessonId
        : null);
    const lessonProgress = progress?.lessonProgress?.find((lp) => lp.lessonId === currentLesson?.lessonId);
    const { saveProgress } = useSaveVideoProgress({
        lessonId: currentLesson?.lessonId || "",
        courseId,
        enabled: currentLesson?.type === "VIDEO" && currentLesson?.status === "READY",
    });
    useEffect(() => {
        if (!selectedLesson &&
            course?.sections &&
            accessibleSectionIds.length > 0) {
            const firstAccessible = course.sections
                .filter((s) => accessibleSectionIds.includes(s.sectionId))
                .flatMap((s) => s.lessons)
                .find((l) => l);
            if (firstAccessible)
                setSelectedLesson(firstAccessible.lessonId);
        }
    }, [course, accessibleSectionIds, selectedLesson]);
    const toggleModule = (sectionId: string) => {
        setExpandedModules((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            }
            else {
                next.add(sectionId);
            }
            return next;
        });
    };
    const progressPercentage = Math.round(((progress?.lessonProgress?.filter((l) => l.completed).length || 0) /
        (flatLessons.length || 1)) *
        100);
    if (isLoading) {
        return (<div className="flex h-[calc(100vh-4rem)]">
        
        <div className="hidden lg:block w-80 border-r border-border bg-muted/10">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-6 w-3/4 mb-2"/>
            <Skeleton className="h-4 w-1/2"/>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/3"/>
                  <Skeleton className="h-4 w-4 rounded-full"/>
                </div>
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-10 w-full"/>
              </div>))}
          </div>
        </div>

        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <Skeleton className="h-full w-full"/>
            </div>

            
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3"/>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32"/>
                <Skeleton className="h-10 w-32"/>
                <Skeleton className="h-10 w-32"/>
              </div>
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-3/4"/>
              </div>
            </div>
          </div>
        </div>
      </div>);
    }
    if (!course) {
        return (<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <EmptyState title="Course not found" description="The course you're looking for doesn't exist." icon={<BookOpen className="h-12 w-12"/>}/>
      </div>);
    }
    return (<div className="learning-surface relative flex h-[calc(100vh-4rem)] bg-[var(--ls-canvas)]">
      
      {sidebarOpen && (<button type="button" aria-label="Close lesson list" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}/>)}

      
      <div className={cn("w-80 border-r border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)] flex flex-col overflow-hidden transition-transform duration-300", "fixed lg:static inset-y-0 left-0 z-50 lg:z-auto", sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="p-4 border-b border-[var(--ls-divider)] bg-[var(--ls-paper)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-[var(--ls-ink)] line-clamp-2">
              {course.title}
            </h2>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => router.push(`/learner/courses/${courseId}`)}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex-1 h-1.5 bg-[var(--ls-neutral-tint)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--ls-accent)] transition-all" style={{ width: `${progressPercentage}%` }}/>
            </div>
            <span className="ls-nums text-xs font-medium whitespace-nowrap text-[var(--ls-ink)]">
              {progressPercentage}%
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.sections?.map((section, idx) => {
            const isExpanded = expandedModules.has(section.sectionId);
            const isSectionAccessible = accessibleSectionIds.includes(section.sectionId);
            return (<div key={section.sectionId} className="border-b border-[var(--ls-divider)]">
                <button onClick={() => toggleModule(section.sectionId)} className="w-full px-4 py-3 bg-[var(--ls-paper)] hover:bg-[var(--ls-paper-quiet)] transition-colors flex items-center justify-between text-left group">
                  <span className="font-semibold text-sm text-[var(--ls-ink)]">
                    Module {idx + 1}
                  </span>
                  {isExpanded ? (<ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors"/>) : (<ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors"/>)}
                </button>

                {isExpanded && (<div className="bg-[var(--ls-paper)]">
                    <div className="px-4 py-2.5 text-sm font-semibold text-[var(--ls-ink)] border-b border-[var(--ls-divider)]">
                      {section.title}
                    </div>
                    {section.lessons?.map((lesson, lIdx) => {
                        const isCompleted = progress?.lessonProgress?.find((p) => p.lessonId === lesson.lessonId)?.completed;
                        const isActive = selectedLesson === lesson.lessonId;
                        const canAccess = isSectionAccessible;
                        return (<button key={lesson.lessonId} onClick={() => canAccess && setSelectedLesson(lesson.lessonId)} disabled={!canAccess} className={cn("w-full px-4 py-3 text-left flex items-start gap-3 transition-colors text-sm relative", isActive
                                ? "bg-[var(--ls-accent-tint)] border-l-4 border-[var(--ls-accent)] pl-3"
                                : "hover:bg-[var(--ls-paper-quiet)]", !canAccess && "opacity-50 cursor-not-allowed")}>
                          <div className="mt-0.5 shrink-0 relative flex items-center justify-center">
                            {isCompleted ? (<div className="relative flex items-center justify-center">
                                <Circle className="h-5 w-5 text-[var(--ls-ok)] fill-[var(--ls-ok)]" strokeWidth={0}/>
                                <Check className="h-3 w-3 text-white absolute" strokeWidth={3}/>
                              </div>) : (<Circle className="h-5 w-5 text-[var(--ls-ink-quiet)] stroke-2 fill-none"/>)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm leading-snug", isActive && "font-semibold text-foreground", !isActive && "text-foreground")}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {lesson.type === "VIDEO"
                                ? "Video"
                                : lesson.type === "TEXT"
                                    ? "Reading"
                                    : lesson.type === "QUIZ"
                                        ? "Quiz"
                                        : "Lesson"}
                              </span>
                              {lesson.duration && (<>
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {Math.ceil(lesson.duration / 60)} min
                                  </span>
                                </>)}
                            </div>
                          </div>
                        </button>);
                    })}
                  </div>)}
              </div>);
        })}
        </div>
      </div>

      
      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--ls-canvas)]">
        <div className="lg:hidden p-4 border-b border-[var(--ls-divider)] bg-[var(--ls-paper)] sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5"/>
            </Button>
            <h2 className="font-semibold text-sm line-clamp-1">
              {course.title}
            </h2>
            <div className="w-10"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            {currentLesson ? (<>
                <div className={cn("w-full rounded-lg overflow-hidden shadow-lg relative", currentLesson.type === "VIDEO"
                ? "aspect-video bg-black"
                : "bg-card min-h-[500px]")}>
                  {!isCurrentLessonAccessible ? (<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900">
                      <BookOpen className="h-16 w-16 mb-4 opacity-50"/>
                      <h3 className="text-xl font-semibold">Content Locked</h3>
                      <p className="text-zinc-400 mt-2">
                        You need to purchase this section to view this lesson.
                      </p>
                    </div>) : currentLesson.type === "VIDEO" ? (<div className="relative w-full h-full">
                      {currentLesson.status === "PROCESSING" ? (<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900">
                          <Loader2 className="h-12 w-12 mb-4 animate-spin"/>
                          <h3 className="text-xl font-semibold">
                            Video Processing
                          </h3>
                          <p className="text-zinc-400 mt-2">
                            Your video is being encoded. This may take a few
                            minutes.
                          </p>
                        </div>) : currentLesson.status !== "READY" ? (<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900">
                          <BookOpen className="h-12 w-12 mb-4 opacity-50"/>
                          <h3 className="text-xl font-semibold">
                            Video Not Ready
                          </h3>
                          <p className="text-zinc-400 mt-2">
                            This video is not available for playback yet.
                          </p>
                        </div>) : isLoadingPlayback ? (<div className="absolute inset-0 flex items-center justify-center text-white bg-zinc-900">
                          <Loader2 className="h-8 w-8 animate-spin"/>
                          <span className="ml-2">Loading video...</span>
                        </div>) : playbackData?.signedUrl ? (<EnhancedVideoPlayer src={playbackData.signedUrl} className="w-full h-full" autoPlay={false} initialPosition={lessonProgress?.lastPosition || 0} title={currentLesson.title} onTimeUpdate={(currentTime, duration) => {
                        saveProgress(currentTime, duration);
                    }} onError={(error) => {
                        toast.error(`Video playback error: ${error}`);
                    }}/>) : playbackErrorType === "access_denied" ? (<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900">
                          <Lock className="h-12 w-12 mb-4 text-yellow-500"/>
                          <h3 className="text-xl font-semibold">
                            Restricted Access
                          </h3>
                          <p className="text-zinc-400 mt-2 text-center max-w-md">
                            You need to purchase this section to watch this video.
                          </p>
                          <Button variant="outline" className="mt-4 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10" onClick={() => router.push(`/learner/courses/${courseId}`)}>
                            View Course Details
                          </Button>
                        </div>) : playbackErrorType === "network" ? (<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900">
                          <Lock className="h-12 w-12 mb-4 text-red-400"/>
                          <h3 className="text-xl font-semibold">
                            Connection Error
                          </h3>
                          <p className="text-zinc-400 mt-2 text-center max-w-md">
                            Unable to connect. Please check your internet connection.
                          </p>
                        </div>) : (<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900">
                          <Lock className="h-12 w-12 mb-4 text-red-400"/>
                          <h3 className="text-xl font-semibold">
                            Unable to Load Video
                          </h3>
                          <p className="text-zinc-400 mt-2 text-center max-w-md">
                            {playbackErrorMessage || "Failed to load video. Please try again."}
                          </p>
                        </div>)}
                    </div>) : currentLesson.type === "TEXT" ? (<div className="w-full h-full bg-card overflow-y-auto">
                      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
                        <article className="prose prose-lg dark:prose-invert max-w-none 
                          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-border/50
                          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                          prose-li:text-muted-foreground prose-li:marker:text-primary
                          prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                        ">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    img: ({ node, ...props }) => (<div className="my-8">
                                  <img {...props} className="rounded-xl shadow-md border border-border/40 w-full"/>
                                </div>),
                }}>
                            {currentLesson.textContent || ""}
                          </ReactMarkdown>
                        </article>
                      </div>
                    </div>) : currentLesson.type === "QUIZ" ? (<div className="w-full h-full bg-card p-8 overflow-y-auto">
                      {currentLesson.questions &&
                    currentLesson.questions.length > 0 ? (<QuizPlayer questions={currentLesson.questions} passingPercentage={70} onComplete={(score, passed) => {
                        if (passed) {
                            handleLessonComplete();
                        }
                    }}/>) : (<div className="flex flex-col items-center justify-center h-full text-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground mb-4"/>
                          <h3 className="text-xl font-semibold">
                            Quiz Setup Incomplete
                          </h3>
                          <p className="text-muted-foreground">
                            This quiz has no questions yet.
                          </p>
                        </div>)}
                    </div>) : (<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                      <BookOpen className="h-16 w-16 mb-4 opacity-50"/>
                      <p>No content available for this lesson</p>
                    </div>)}
                </div>

                <div>
                  <h1 className="text-2xl font-semibold mb-4 text-[var(--ls-ink)]">
                    {currentLesson.title}
                  </h1>

                  <div className="space-y-4">
                    {currentLesson.description && (<p className="text-muted-foreground leading-relaxed text-base">
                        {currentLesson.description}
                      </p>)}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                      {currentLesson.duration && (<span>
                          {Math.ceil(currentLesson.duration / 60)} min
                        </span>)}
                      {currentLesson.duration && (<>
                          <span>•</span>
                          <span>
                            {currentLesson.type === "VIDEO"
                    ? "Video"
                    : currentLesson.type === "TEXT"
                        ? "Reading"
                        : currentLesson.type === "QUIZ"
                            ? "Quiz"
                            : "Lesson"}
                          </span>
                        </>)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[var(--ls-divider)]">
                    <Button variant="outline" onClick={handlePrev} disabled={!prevLesson} size="sm">
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      <Button onClick={handleLessonComplete} disabled={updateProgress.isPending ||
                progress?.lessonProgress?.find((p) => p.lessonId === selectedLesson)?.completed} size="sm">
                        {progress?.lessonProgress?.find((p) => p.lessonId === selectedLesson)?.completed
                ? "Completed"
                : "Mark as Complete"}
                      </Button>
                      <Button variant="outline" onClick={handleNext} disabled={!nextLesson} size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </>) : (<div className="flex flex-col items-center justify-center h-96 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-50"/>
                <h3 className="text-xl font-semibold mb-2">
                  Select a lesson to start learning
                </h3>
                <p className="text-muted-foreground">
                  Choose a lesson from the sidebar to begin.
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
}
