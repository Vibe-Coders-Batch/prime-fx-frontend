import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { BlogPost } from "../types";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "P"
  );
}

export function BlogPostHeader({ post }: { post: BlogPost }) {
  const published = post.publishedAt ?? post.updatedAt;
  return (
    <header className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          {post.category && (
            <Link
              href={`/blogs?category=${encodeURIComponent(post.category)}`}
              className="font-semibold text-primary hover:underline"
            >
              {post.category}
            </Link>
          )}
          {post.category && <span aria-hidden>·</span>}
          <time dateTime={published}>{format(new Date(published), "MMMM d, yyyy")}</time>
          {post.readingTimeMinutes ? (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1 normal-case">
                <Clock className="h-3 w-3" aria-hidden />
                {post.readingTimeMinutes} min read
              </span>
            </>
          ) : null}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
          {post.excerpt}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials(post.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-semibold text-foreground">{post.author.name}</p>
          {post.author.bio && (
            <p className="text-xs text-muted-foreground max-w-md">{post.author.bio}</p>
          )}
        </div>
      </div>

      {post.coverImageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 880px, 100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blogs?tag=${encodeURIComponent(tag)}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            >
              <Badge variant="outline" className="text-xs font-normal">
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
