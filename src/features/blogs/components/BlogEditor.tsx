"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Save, Send, Loader2, Trash2 } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useCreateBlog, useDeleteBlog, useUpdateBlog } from "../hooks/use-blogs";
import type { BlogPost } from "../types";

const schema = z.object({
  title: z.string().min(3, "Title is too short").max(200),
  slug: z
    .string()
    .max(120)
    .optional()
    .transform((v) => (v ? v.trim() : "")),
  excerpt: z.string().min(10, "Excerpt is too short").max(500),
  content: z.string().min(20, "Content is too short"),
  coverImageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  category: z.string().max(80).optional(),
});

type FormValues = z.infer<typeof schema>;

interface BlogEditorProps {
  mode: "create" | "edit";
  initial?: BlogPost;
  /**
   * Base path for post-save navigation. Defaults to `/instructor/blogs` so the
   * existing instructor flow is unchanged. Admin / content admin surfaces pass
   * `/admin/blogs` so the editor stays within their permitted route prefix.
   */
  redirectBase?: string;
}

function autoSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogEditor({
  mode,
  initial,
  redirectBase = "/instructor/blogs",
}: BlogEditorProps) {
  const router = useRouter();
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const deleteMutation = useDeleteBlog();

  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      excerpt: initial?.excerpt ?? "",
      content: initial?.content ?? "",
      coverImageUrl: initial?.coverImageUrl ?? "",
      category: initial?.category ?? "",
    }),
    [initial],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const titleValue = watch("title");
  const contentValue = watch("content");

  useEffect(() => {
    if (mode === "create" && !slugTouched && titleValue) {
      setValue("slug", autoSlug(titleValue), { shouldValidate: false });
    }
  }, [titleValue, slugTouched, mode, setValue]);

  function addTag() {
    const value = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (!value) return;
    if (tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags([...tags, value]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((current) => current.filter((t) => t !== tag));
  }

  async function submit(values: FormValues, publish: boolean) {
    const payload = {
      title: values.title.trim(),
      slug: values.slug?.trim() || undefined,
      excerpt: values.excerpt.trim(),
      content: values.content,
      coverImageUrl: values.coverImageUrl?.trim() || undefined,
      category: values.category?.trim() || undefined,
      tags,
      status: publish ? ("PUBLISHED" as const) : ("DRAFT" as const),
    };

    try {
      if (mode === "create") {
        const post = await createMutation.mutateAsync(payload);
        toast.success(publish ? "Post published" : "Draft saved");
        router.push(`${redirectBase}/${post.id}/edit`);
      } else if (initial) {
        const updated = await updateMutation.mutateAsync({
          id: initial.id,
          dto: payload,
        });
        toast.success(publish ? "Post published" : "Draft saved");
        if (updated.slug !== initial.slug) {
          router.replace(`${redirectBase}/${updated.id}/edit`);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save the post";
      toast.error(message);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync(initial.id);
      toast.success("Post deleted");
      router.push(redirectBase);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not delete the post";
      toast.error(message);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((values) => submit(values, false))}
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="A clear, specific title"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="auto-generated-from-title"
                {...register("slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="One or two sentences that show up on cards and search results."
                rows={3}
                {...register("excerpt")}
                aria-invalid={!!errors.excerpt}
              />
              {errors.excerpt && (
                <p className="text-xs text-destructive">{errors.excerpt.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Business & Leadership"
                {...register("category")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coverImageUrl">Cover image URL</Label>
            <Input
              id="coverImageUrl"
              placeholder="https://… (optional)"
              {...register("coverImageUrl")}
            />
            {errors.coverImageUrl && (
              <p className="text-xs text-destructive">
                {errors.coverImageUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                    className="rounded-full hover:bg-background/40"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="h-8 w-44 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <Tabs defaultValue="write" className="w-full">
            <div className="flex items-center justify-between">
              <Label>Body (Markdown)</Label>
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="write" className="mt-3">
              <Textarea
                id="content"
                rows={18}
                placeholder="# Heading\n\nWrite your post in Markdown…"
                {...register("content")}
                aria-invalid={!!errors.content}
                className="font-mono text-sm leading-relaxed"
              />
              {errors.content && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.content.message}
                </p>
              )}
            </TabsContent>
            <TabsContent value="preview" className="mt-3">
              <div className="min-h-[200px] rounded-md border border-border bg-background p-6">
                {contentValue ? (
                  <MarkdownRenderer content={contentValue} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nothing to preview yet. Start writing in the editor.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="outline" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => submit(values, true))}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
        {mode === "edit" && initial && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
