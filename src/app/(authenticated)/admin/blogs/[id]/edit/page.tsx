"use client";

import { use } from "react";
import Link from "next/link";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { BlogEditor } from "@/features/blogs/components/BlogEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pen } from "lucide-react";
import { useBlog } from "@/features/blogs/hooks/use-blogs";
import { useAuthStore } from "@/lib/store/auth-store";
import { canEditBlog } from "@/features/blogs/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditBlogPostPage({ params }: PageProps) {
  const { id } = use(params);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const { data, isLoading } = useBlog({ id, enabled: isHydrated });

  if (isLoading || !isHydrated) {
    return (
      <LearningSurface width="wide">
        <LearningPageHeader title="Edit post" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </LearningSurface>
    );
  }

  if (!data) {
    return (
      <LearningSurface>
        <LearningPageHeader title="Post not found" />
        <Panel>
        <EmptyState
          title="Couldn’t load this post"
          description="The post may have been deleted or is no longer accessible."
          icon={<Pen className="h-10 w-10" />}
        />
        </Panel>
      </LearningSurface>
    );
  }

  if (!canEditBlog({ id: user?.id, role: user?.role }, data)) {
    return (
      <LearningSurface>
        <LearningPageHeader title="Not allowed" />
        <Panel>
        <EmptyState
          title="You don’t have permission to edit this post"
          description="Only the post’s author or a platform/content admin can edit."
          icon={<Pen className="h-10 w-10" />}
        />
        </Panel>
      </LearningSurface>
    );
  }

  return (
    <LearningSurface width="wide">
      <LearningPageHeader
        title={data.status === "PUBLISHED" ? "Edit published post" : "Edit draft"}
        description="Changes are saved manually. Use Save draft or Publish."
        actions={
        data.status === "PUBLISHED" ? (
          <Link href={`/blogs/${data.slug}`} target="_blank">
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4" />
              View live
            </Button>
          </Link>
        ) : null
        }
      />
      <BlogEditor mode="edit" initial={data} redirectBase="/admin/blogs" />
    </LearningSurface>
  );
}
