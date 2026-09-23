"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink, Pen, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { StatusPill } from "@/components/learning/status-pill";
import { useAuthStore } from "@/lib/store/auth-store";
import { useBlogs } from "@/features/blogs/hooks/use-blogs";
import { BlogStatusBadge } from "@/features/blogs/components/BlogStatusBadge";
import { canAuthorBlogs, canModerateBlogs } from "@/features/blogs/types";

export default function InstructorBlogsPage() {
    const user = useAuthStore((s) => s.user);
    const isHydrated = useAuthStore((s) => s.isHydrated);

    const allowed = canAuthorBlogs(user?.role);
    const isModerator = canModerateBlogs(user?.role);

    const filters = useMemo(
        () => ({
            authorId: isModerator ? undefined : user?.id,
            limit: 50,
        }),
        [isModerator, user?.id],
    );

    const { data, isLoading } = useBlogs({
        filters,
        enabled: isHydrated && allowed && !!user?.id,
    });

    if (isHydrated && !allowed) {
        return (
            <LearningSurface>
                <LearningPageHeader
                    title="Blog posts"
                    description="You need an instructor account to author posts."
                />
                <Panel>
                    <EmptyState
                        title="Not enabled for your account"
                        description="Talk to a Prime Learning admin to be granted authoring access."
                        icon={<Pen className="h-10 w-10" />}
                    />
                </Panel>
            </LearningSurface>
        );
    }

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Blog posts"
                description={
                    isModerator
                        ? "All posts. Moderators can edit any post."
                        : "Your blog posts. Draft, publish, and revise."
                }
                actions={
                    <Link href="/instructor/blogs/new">
                        <Button>
                            <Plus aria-hidden="true" className="h-4 w-4" />
                            New post
                        </Button>
                    </Link>
                }
            />

            {isLoading ? (
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                </div>
            ) : !data || data.data.length === 0 ? (
                <Panel>
                    <EmptyState
                        title="No posts yet"
                        description="Start your first post. Drafts are private until you publish."
                        icon={<Pen className="h-10 w-10" />}
                        action={{
                            label: "Write the first post",
                            onClick: () => {
                                window.location.href = "/instructor/blogs/new";
                            },
                        }}
                    />
                </Panel>
            ) : (
                <Panel className="overflow-hidden">
                    <ul className="divide-y divide-[var(--ls-divider)]">
                        {data.data.map((post) => (
                            <li
                                key={post.id}
                                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                            >
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="truncate text-sm font-semibold text-[var(--ls-ink)]">
                                            {post.title}
                                        </h2>
                                        <BlogStatusBadge status={post.status} />
                                        {post.featured ? (
                                            <StatusPill tone="accent">Featured</StatusPill>
                                        ) : null}
                                    </div>
                                    <p className="line-clamp-1 text-sm text-[var(--ls-ink-quiet)]">
                                        {post.excerpt}
                                    </p>
                                    <p className="ls-nums text-xs text-[var(--ls-ink-quiet)]">
                                        {post.author.name} ·{" "}
                                        {format(new Date(post.updatedAt), "MMM d, yyyy")}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:shrink-0">
                                    {post.status === "PUBLISHED" ? (
                                        <Link href={`/blogs/${post.slug}`} target="_blank">
                                            <Button size="sm" variant="outline">
                                                <ExternalLink
                                                    aria-hidden="true"
                                                    className="h-4 w-4"
                                                />
                                                View
                                                <span className="sr-only"> {post.title}</span>
                                            </Button>
                                        </Link>
                                    ) : null}
                                    <Link href={`/instructor/blogs/${post.id}/edit`}>
                                        <Button size="sm">
                                            <Pencil aria-hidden="true" className="h-4 w-4" />
                                            Edit
                                            <span className="sr-only"> {post.title}</span>
                                        </Button>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Panel>
            )}
        </LearningSurface>
    );
}
