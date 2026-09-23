"use client";

import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
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
      <LearningSurface>
        <LearningPageHeader title="New blog post" />
        <Panel>
          <EmptyState
            title="Access required"
            description="Only platform admins, content admins, and instructors can write posts."
            icon={<ShieldAlert className="h-10 w-10" />}
          />
        </Panel>
      </LearningSurface>
    );
  }

  return (
    <LearningSurface width="wide">
      <LearningPageHeader
        title="Write a new post"
        description="Drafts are private until you publish. Posts use Markdown; switch to Preview to see how they will render on the website."
      />
      <BlogEditor mode="create" redirectBase="/admin/blogs" />
    </LearningSurface>
  );
}
