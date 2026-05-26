"use client";

import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, StarOff, Archive, EyeOff, Eye, Loader2, Pencil } from "lucide-react";
import { BlogStatusBadge } from "./BlogStatusBadge";
import {
  useArchiveBlog,
  useFeatureBlog,
  usePublishBlog,
  useUnpublishBlog,
} from "../hooks/use-blogs";
import type { BlogPost } from "../types";
import { useAuthStore } from "@/lib/store/auth-store";

export function BlogAdminTable({ posts }: { posts: BlogPost[] }) {
  const publish = usePublishBlog();
  const unpublish = useUnpublishBlog();
  const archive = useArchiveBlog();
  const feature = useFeatureBlog();
  const role = useAuthStore((s) => s.user?.role);
  const editBase =
    role === "INSTRUCTOR" ? "/instructor/blogs" : "/admin/blogs";

  async function runAction(action: () => Promise<unknown>, successMessage: string) {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Action failed";
      toast.error(message);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        No posts match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Post</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const pending =
              publish.isPending || unpublish.isPending || archive.isPending || feature.isPending;
            return (
              <TableRow key={post.id}>
                <TableCell className="max-w-md align-top">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="font-medium text-foreground hover:text-primary"
                    target="_blank"
                  >
                    {post.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {post.featured && (
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    )}
                    {post.category && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top text-sm">
                  <div className="font-medium">{post.author.name}</div>
                  {post.author.email && (
                    <div className="text-xs text-muted-foreground">
                      {post.author.email}
                    </div>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  <BlogStatusBadge status={post.status} />
                </TableCell>
                <TableCell className="align-top text-xs text-muted-foreground">
                  {format(new Date(post.updatedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex flex-wrap justify-end gap-1">
                    <Link href={`${editBase}/${post.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    {post.status === "DRAFT" || post.status === "ARCHIVED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          runAction(
                            () => publish.mutateAsync(post.id),
                            `Published "${post.title}"`,
                          )
                        }
                      >
                        {publish.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        Publish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          runAction(
                            () => unpublish.mutateAsync(post.id),
                            `Reverted "${post.title}" to draft`,
                          )
                        }
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                        Unpublish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() =>
                        runAction(
                          () => feature.mutateAsync({ id: post.id, featured: !post.featured }),
                          post.featured
                            ? `Unfeatured "${post.title}"`
                            : `Featured "${post.title}"`,
                        )
                      }
                    >
                      {post.featured ? (
                        <StarOff className="h-3.5 w-3.5" />
                      ) : (
                        <Star className="h-3.5 w-3.5" />
                      )}
                      {post.featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() =>
                        runAction(
                          () => archive.mutateAsync(post.id),
                          `Archived "${post.title}"`,
                        )
                      }
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
