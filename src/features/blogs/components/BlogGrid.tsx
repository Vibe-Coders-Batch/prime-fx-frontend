import type { BlogPost } from "../types";
import { BlogCard } from "./BlogCard";

interface BlogGridProps {
  posts: BlogPost[];
  showFeatured?: boolean;
}

export function BlogGrid({ posts, showFeatured }: BlogGridProps) {
  if (posts.length === 0) return null;

  const [first, ...rest] = posts;
  const featuredCandidate = showFeatured && first ? first : null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featuredCandidate && (
        <BlogCard
          post={featuredCandidate}
          featured
          className="md:col-span-2 lg:col-span-3"
        />
      )}
      {(featuredCandidate ? rest : posts).map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
