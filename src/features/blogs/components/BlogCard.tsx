import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "../types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  className?: string;
}

function authorInitials(name: string): string {
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

export function BlogCard({ post, featured, className }: BlogCardProps) {
  const published = post.publishedAt ?? post.updatedAt;
  const dateText = format(new Date(published), "MMM d, yyyy");

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        featured && "md:flex-row md:col-span-2",
        className,
      )}
      aria-label={`Read article: ${post.title}`}
    >
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/15 via-muted to-background",
          featured && "md:aspect-auto md:w-1/2",
        )}
      >
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-6xl text-muted-foreground/40">
              {post.title[0]?.toUpperCase() ?? "P"}
            </span>
          </div>
        )}
        {post.featured && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-5 sm:p-6",
          featured && "md:p-8 md:gap-4",
        )}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {post.category && (
            <span className="font-medium uppercase tracking-wide text-primary">
              {post.category}
            </span>
          )}
          {post.category && <span>·</span>}
          <time dateTime={published}>{dateText}</time>
          {post.readingTimeMinutes ? (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                {post.readingTimeMinutes} min read
              </span>
            </>
          ) : null}
        </div>

        <h3
          className={cn(
            "font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
            featured
              ? "text-2xl sm:text-3xl md:text-4xl"
              : "text-lg sm:text-xl",
          )}
        >
          {post.title}
        </h3>

        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            featured ? "line-clamp-4 sm:text-base" : "line-clamp-3",
          )}
        >
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {authorInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{post.author.name}</p>
            {post.author.role && (
              <p className="text-[10px] uppercase tracking-wide">
                {post.author.role.replace("_", " ").toLowerCase()}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
