"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldAlert, Search, Plus, Pen } from "lucide-react";
import { useAdminBlogs } from "@/features/blogs/hooks/use-blogs";
import { useAuthStore } from "@/lib/store/auth-store";
import { canModerateBlogs } from "@/features/blogs/types";
import { BlogAdminTable } from "@/features/blogs/components/BlogAdminTable";
import type { BlogStatus } from "@/features/blogs/types";

export default function AdminBlogsPage() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const allowed = canModerateBlogs(user?.role);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState<string>("all");

  const filters = useMemo(
    () => ({
      search: search || undefined,
      status: status === "all" ? undefined : (status as BlogStatus),
      featured: featuredOnly === "featured" ? true : undefined,
      limit: 100,
    }),
    [search, status, featuredOnly],
  );

  const { data, isLoading } = useAdminBlogs({
    filters,
    enabled: isHydrated && allowed,
  });

  if (isHydrated && !allowed) {
    return (
      <LearningSurface>
        <LearningPageHeader
          title="Blog moderation"
          description="Restricted to platform or content administrators."
        />
        <Panel>
          <EmptyState
            title="Access required"
            description="This area is restricted to PLATFORM_ADMIN and CONTENT_ADMIN accounts."
            icon={<ShieldAlert className="h-10 w-10" />}
          />
        </Panel>
      </LearningSurface>
    );
  }

  return (
    <LearningSurface width="wide">
      <LearningPageHeader
        title="Blog"
        description="Write new posts, then review, feature, archive, and publish posts from across the platform."
        actions={
          <Link href="/admin/blogs/new">
            <Button>
              <Plus aria-hidden="true" className="h-4 w-4" />
              New post
            </Button>
          </Link>
        }
      />
      <Panel className="mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ls-ink-quiet)]" />
          <Input
            aria-label="Search posts"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="Filter posts by status" className="w-full sm:w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={featuredOnly} onValueChange={setFeaturedOnly}>
          <SelectTrigger aria-label="Filter featured posts" className="w-full sm:w-[180px]">
            <SelectValue placeholder="All posts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All posts</SelectItem>
            <SelectItem value="featured">Featured only</SelectItem>
          </SelectContent>
        </Select>
      </Panel>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Panel className="overflow-hidden">
          <BlogAdminTable posts={data?.data ?? []} />
        </Panel>
      )}
    </LearningSurface>
  );
}
