"use client";

import { useRelatedBlogs } from "../hooks/use-blogs";
import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

export function RelatedPosts({ slug }: { slug: string }) {
  const { data, isLoading } = useRelatedBlogs(slug, 3);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Keep reading
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {data.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
