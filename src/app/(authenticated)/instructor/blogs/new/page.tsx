"use client";

import { Pen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { BlogEditor } from "@/features/blogs/components/BlogEditor";
import { useAuthStore } from "@/lib/store/auth-store";
import { canAuthorBlogs } from "@/features/blogs/types";

export default function NewBlogPostPage() {
    const user = useAuthStore((s) => s.user);
    const isHydrated = useAuthStore((s) => s.isHydrated);

    if (isHydrated && !canAuthorBlogs(user?.role)) {
        return (
            <LearningSurface>
                <LearningPageHeader title="New blog post" />
                <Panel>
                    <EmptyState
                        title="Authoring not enabled"
                        description="Ask a Prime Learning admin to enable blog authoring for your account."
                        icon={<Pen className="h-10 w-10" />}
                    />
                </Panel>
            </LearningSurface>
        );
    }

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Write a new post"
                description="Drafts are private until you publish. Posts use Markdown; switch to Preview to see how it will render."
            />
            <BlogEditor mode="create" />
        </LearningSurface>
    );
}
