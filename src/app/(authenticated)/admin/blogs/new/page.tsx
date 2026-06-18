"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { BlogEditor } from "@/features/blogs/components/BlogEditor";
import { useAuthStore } from "@/lib/store/auth-store";
import { canAuthorBlogs } from "@/features/blogs/types";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldAlert } from "lucide-react";

export default function AdminNewBlogPostPage() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (isHydrated && !canAuthorBlogs(user?.role)) {
    return (
      <PageLayout header="New blog post">
        <EmptyState
          title="Access required"
          description="Only platform admins, content admins, and instructors can write posts."
          icon={<ShieldAlert className="h-10 w-10" />}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header="Write a new post"
      description="Drafts are private until you publish. Posts use Markdown; switch to Preview to see how they will render on the website."
    >
      <BlogEditor mode="create" redirectBase="/admin/blogs" />
    </PageLayout>
  );
}
