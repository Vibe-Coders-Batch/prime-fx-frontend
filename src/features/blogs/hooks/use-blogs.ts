import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { blogsApi } from "../api/blogs.api";
import type {
  BlogFilters,
  BlogListResponse,
  BlogPost,
  CreateBlogDto,
  UpdateBlogDto,
} from "../types";

interface UseBlogsParams {
  filters?: BlogFilters;
  enabled?: boolean;
  initialData?: BlogListResponse;
}

export function useBlogs({ filters, enabled, initialData }: UseBlogsParams = {}) {
  return useQuery<BlogListResponse>({
    queryKey: queryKeys.blogs.list(filters),
    queryFn: () => blogsApi.list(filters ?? {}),
    enabled: enabled !== false,
    staleTime: 30_000,
    initialData,
    refetchOnWindowFocus: false,
  });
}

interface UseBlogBySlugParams {
  slug?: string;
  enabled?: boolean;
  initialData?: BlogPost | null;
}

export function useBlogBySlug({ slug, enabled, initialData }: UseBlogBySlugParams) {
  return useQuery<BlogPost | null>({
    queryKey: queryKeys.blogs.bySlug(slug),
    queryFn: () => blogsApi.getBySlug(slug as string),
    enabled: !!slug && enabled !== false,
    staleTime: 60_000,
    initialData,
  });
}

interface UseBlogParams {
  id?: string;
  enabled?: boolean;
}

export function useBlog({ id, enabled }: UseBlogParams) {
  return useQuery<BlogPost | null>({
    queryKey: queryKeys.blogs.detail(id),
    queryFn: () => blogsApi.getById(id as string),
    enabled: !!id && enabled !== false,
    staleTime: 30_000,
  });
}

export function useRelatedBlogs(slug?: string, limit = 3) {
  return useQuery<BlogPost[]>({
    queryKey: queryKeys.blogs.related(slug),
    queryFn: () => blogsApi.related(slug as string, limit),
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function useAdminBlogs({ filters, enabled }: UseBlogsParams = {}) {
  return useQuery<BlogListResponse>({
    queryKey: queryKeys.blogs.admin(filters),
    queryFn: () => blogsApi.adminList(filters ?? {}),
    enabled: enabled !== false,
    staleTime: 15_000,
  });
}

function invalidateBlogQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all() });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createBlog"],
    mutationFn: (dto: CreateBlogDto) => blogsApi.create(dto),
    onSuccess: () => invalidateBlogQueries(queryClient),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateBlog"],
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBlogDto }) =>
      blogsApi.update(id, dto),
    onSuccess: (post) => {
      queryClient.setQueryData(queryKeys.blogs.detail(post.id), post);
      queryClient.setQueryData(queryKeys.blogs.bySlug(post.slug), post);
      invalidateBlogQueries(queryClient);
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteBlog"],
    mutationFn: (id: string) => blogsApi.remove(id),
    onSuccess: () => invalidateBlogQueries(queryClient),
  });
}

export function usePublishBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["publishBlog"],
    mutationFn: (id: string) => blogsApi.publish(id),
    onSuccess: (post) => {
      queryClient.setQueryData(queryKeys.blogs.detail(post.id), post);
      invalidateBlogQueries(queryClient);
    },
  });
}

export function useUnpublishBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["unpublishBlog"],
    mutationFn: (id: string) => blogsApi.unpublish(id),
    onSuccess: (post) => {
      queryClient.setQueryData(queryKeys.blogs.detail(post.id), post);
      invalidateBlogQueries(queryClient);
    },
  });
}

export function useArchiveBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["archiveBlog"],
    mutationFn: (id: string) => blogsApi.archive(id),
    onSuccess: () => invalidateBlogQueries(queryClient),
  });
}

export function useFeatureBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["featureBlog"],
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      blogsApi.feature(id, featured),
    onSuccess: () => invalidateBlogQueries(queryClient),
  });
}
