"use client";

import { use } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
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

export default function EditBlogPostPage({ params }: PageProps) {
  const { id } = use(params);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const { data, isLoading } = useBlog({ id, enabled: isHydrated });

  if (isLoading || !isHydrated) {
    return (
      <PageLayout header="Edit post">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout header="Post not found">
        <EmptyState
          title="Couldn’t load this post"
          description="The post may have been deleted or is no longer accessible."
          icon={<Pen className="h-10 w-10" />}
        />
      </PageLayout>
    );
  }

  if (!canEditBlog({ id: user?.id, role: user?.role }, data)) {
    return (
      <PageLayout header="Not allowed">
        <EmptyState
          title="You can only edit your own posts"
          description="If you believe this is a mistake, ask a Prime Learning admin."
          icon={<Pen className="h-10 w-10" />}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={data.status === "PUBLISHED" ? "Edit published post" : "Edit draft"}
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
    >
      <BlogEditor mode="edit" initial={data} />
    </PageLayout>
  );
}
