"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBlogs } from "@/features/blogs/hooks/use-blogs";
import { BlogGrid } from "@/features/blogs/components/BlogGrid";
import { BlogFilters } from "@/features/blogs/components/BlogFilters";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";

export function BlogsIndexClient({ initialPage }: { initialPage?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const DEFAULT_ARTICLE_CATEGORIES = [
    "artificial intelligence",
    "data science",
    "Career Development",
    "machine-learning",
  ] as const;

  const tagParam = searchParams.get("tag") ?? undefined;
  const categoryParam = searchParams.get("category") ?? undefined;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(categoryParam ?? "all");
  const [page, setPage] = useState<number>(initialPage ?? 1);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      category: category === "all" ? undefined : category,
      tag: tagParam,
      status: "PUBLISHED" as const,
      page,
      limit: 12,
    }),
    [search, category, tagParam, page],
  );

  const { data, isLoading } = useBlogs({ filters });

  function setTag(tag: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set("tag", tag);
    else params.delete("tag");
    router.replace(`/blogs${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
    setPage(1);
  }

  function setCategoryAndSync(value: string) {
    setCategory(value);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("category", value);
    else params.delete("category");
    router.replace(`/blogs${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  }

  const posts = data?.data ?? [];
  const showFeatured = page === 1 && !search && (category === "all" || !category) && !tagParam;
  const categories = Array.from(
    new Set([...(data?.availableCategories ?? []), ...DEFAULT_ARTICLE_CATEGORIES]),
  );

  return (
    <div className="space-y-8">
      <BlogFilters
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        category={category}
        onCategoryChange={setCategoryAndSync}
        categories={categories}
        activeTag={tagParam}
        tags={data?.availableTags ?? []}
        onTagSelect={setTag}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description={
            search || tagParam || category !== "all"
              ? "Try adjusting your search or filters."
              : "The first Prime Learning articles are on their way."
          }
          illustration="/illustrations/no_data.svg"
        />
      ) : (
        <>
          <BlogGrid posts={posts} showFeatured={showFeatured} />
          {data && data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              onPageChange={(next) => setPage(next)}
            />
          )}
        </>
      )}
    </div>
  );
}
