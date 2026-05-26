import type { User } from "@/features/auth/types";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogAuthor {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  role?: User["role"];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  author: BlogAuthor;
  tags: string[];
  category?: string;
  status: BlogStatus;
  featured?: boolean;
  publishedAt?: string;
  readingTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  status?: BlogStatus;
  authorId?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface BlogListResponse {
  data: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  availableCategories: string[];
  availableTags: string[];
}

export interface CreateBlogDto {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  tags?: string[];
  category?: string;
  status?: BlogStatus;
}

export type UpdateBlogDto = Partial<CreateBlogDto> & {
  featured?: boolean;
};

export type BlogAuthoringRole = "INSTRUCTOR" | "PLATFORM_ADMIN" | "CONTENT_ADMIN";

export const BLOG_AUTHORING_ROLES: BlogAuthoringRole[] = [
  "INSTRUCTOR",
  "PLATFORM_ADMIN",
  "CONTENT_ADMIN",
];

export const BLOG_MODERATION_ROLES = ["PLATFORM_ADMIN", "CONTENT_ADMIN"] as const;

export type BlogModerationRole = (typeof BLOG_MODERATION_ROLES)[number];

export function canAuthorBlogs(role: User["role"] | undefined | null): boolean {
  if (!role) return false;
  return BLOG_AUTHORING_ROLES.includes(role as BlogAuthoringRole);
}

export function canModerateBlogs(role: User["role"] | undefined | null): boolean {
  if (!role) return false;
  return (BLOG_MODERATION_ROLES as readonly string[]).includes(role);
}

export function canEditBlog(
  user: { id?: string; role?: User["role"] } | null | undefined,
  post: Pick<BlogPost, "author">,
): boolean {
  if (!user?.role) return false;
  if (canModerateBlogs(user.role)) return true;
  return user.id != null && user.id === post.author.id;
}
