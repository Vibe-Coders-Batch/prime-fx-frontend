"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, Pencil, ExternalLink, Pen } from "lucide-react";
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
      <PageLayout
        header="Blog posts"
        description="You need an instructor account to author posts."
      >
        <EmptyState
          title="Not enabled for your account"
          description="Talk to a Prime Learning admin to be granted authoring access."
          icon={<Pen className="h-10 w-10" />}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header="Blog posts"
      description={
        isModerator
          ? "All posts. Moderators can edit any post."
          : "Your blog posts. Draft, publish, and revise."
      }
      actions={
        <Link href="/instructor/blogs/new">
          <Button>
            <Plus className="h-4 w-4" />
            New post
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Start your first post — drafts are private until you publish."
          icon={<Pen className="h-10 w-10" />}
          action={{
            label: "Write the first post",
            onClick: () => {
              window.location.href = "/instructor/blogs/new";
            },
          }}
        />
      ) : (
        <div className="space-y-3">
          {data.data.map((post) => (
            <Card key={post.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-foreground sm:text-lg">
                      {post.title}
                    </h3>
                    <BlogStatusBadge status={post.status} />
                    {post.featured && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {post.author.name} ·{" "}
                    {format(new Date(post.updatedAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.status === "PUBLISHED" && (
                    <Link href={`/blogs/${post.slug}`} target="_blank">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  )}
                  <Link href={`/instructor/blogs/${post.id}/edit`}>
                    <Button size="sm">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
