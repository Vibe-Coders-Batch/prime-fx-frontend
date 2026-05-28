import { apiClient } from "@/lib/api/client";
import type { AxiosError } from "axios";
import type {
  BlogPost,
  BlogFilters,
  BlogListResponse,
  CreateBlogDto,
  UpdateBlogDto,
} from "../types";
import { mockBlogStore, MOCK_BLOG_AUTHORS } from "./mock-data";

const MOCK_ENV = process.env.NEXT_PUBLIC_BLOGS_MOCK;
const MOCK_FORCED = MOCK_ENV === "1" || MOCK_ENV === "true";
const MOCK_DISABLED = MOCK_ENV === "0" || MOCK_ENV === "false";

const DEFAULT_ARTICLE_CATEGORIES = [
  "artificial intelligence",
  "data science",
  "Career Development",
  "machine-learning",
] as const;

function shouldUseMockByDefault(): boolean {
  if (MOCK_FORCED) return true;
  if (MOCK_DISABLED) return false;
  // Real backend exists by default; mock kicks in only if endpoint is missing (404)
  // or explicitly via NEXT_PUBLIC_BLOGS_MOCK=1.
  return false;
}

function isMissingEndpoint(error: unknown): boolean {
  const err = error as AxiosError | undefined;
  const status = err?.response?.status;
  return status === 404 || status === 501 || status === 405;
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  return { slice, total, totalPages };
}

function buildMockListResponse(filters: BlogFilters): BlogListResponse {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 12));
  const all = mockBlogStore.list();

  const availableCategories = Array.from(
    new Set([
      ...DEFAULT_ARTICLE_CATEGORIES,
      ...all.filter((p) => p.category).map((p) => p.category as string),
    ]),
  ).sort();
  const availableTags = Array.from(new Set(all.flatMap((p) => p.tags))).sort();

  const status = filters.status ?? "PUBLISHED";
  let filtered = all;

  if (status) filtered = filtered.filter((p) => p.status === status);
  if (filters.authorId) filtered = filtered.filter((p) => p.author.id === filters.authorId);
  if (filters.category)
    filtered = filtered.filter((p) => p.category === filters.category);
  if (filters.tag) filtered = filtered.filter((p) => p.tags.includes(filters.tag!));
  if (filters.featured) filtered = filtered.filter((p) => p.featured);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((p) =>
      [p.title, p.excerpt, p.content, ...p.tags, p.category ?? ""].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }

  filtered.sort((a, b) => {
    const aTime = new Date(a.publishedAt ?? a.updatedAt).getTime();
    const bTime = new Date(b.publishedAt ?? b.updatedAt).getTime();
    return bTime - aTime;
  });

  const { slice, total, totalPages } = paginate(filtered, page, limit);

  return {
    data: slice,
    pagination: { page, limit, total, totalPages },
    availableCategories,
    availableTags,
  };
}

function getMockCurrentAuthor() {
  return MOCK_BLOG_AUTHORS["mock-instructor-1"];
}

function pickAuthorFromAuthStore(): BlogPost["author"] {
  if (typeof window === "undefined") return getMockCurrentAuthor();
  try {
    const raw = window.localStorage.getItem("auth-storage");
    if (!raw) return getMockCurrentAuthor();
    const parsed = JSON.parse(raw);
    const user = parsed?.state?.user;
    if (!user) return getMockCurrentAuthor();
    return {
      id: user.id ?? "mock-current-user",
      name:
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.email ||
        "Prime Author",
      email: user.email,
      role: user.role,
    };
  } catch {
    return getMockCurrentAuthor();
  }
}

const mockApi = {
  async list(filters: BlogFilters = {}): Promise<BlogListResponse> {
    return buildMockListResponse(filters);
  },
  async getBySlug(slug: string): Promise<BlogPost | null> {
    const post = mockBlogStore.findBySlug(slug);
    return post ?? null;
  },
  async getById(id: string): Promise<BlogPost | null> {
    const post = mockBlogStore.findById(id);
    return post ?? null;
  },
  async create(dto: CreateBlogDto): Promise<BlogPost> {
    return mockBlogStore.insert({ ...dto, author: pickAuthorFromAuthStore() });
  },
  async update(id: string, dto: UpdateBlogDto): Promise<BlogPost> {
    const updated = mockBlogStore.update(id, dto as Partial<BlogPost>);
    if (!updated) throw new Error("Blog post not found");
    return updated;
  },
  async remove(id: string): Promise<void> {
    if (!mockBlogStore.remove(id)) throw new Error("Blog post not found");
  },
  async publish(id: string): Promise<BlogPost> {
    return this.update(id, { status: "PUBLISHED" });
  },
  async unpublish(id: string): Promise<BlogPost> {
    return this.update(id, { status: "DRAFT" });
  },
  async archive(id: string): Promise<BlogPost> {
    return this.update(id, { status: "ARCHIVED" });
  },
  async feature(id: string, featured: boolean): Promise<BlogPost> {
    return this.update(id, { featured });
  },
  async related(slug: string, limit = 3): Promise<BlogPost[]> {
    const source = mockBlogStore.findBySlug(slug);
    if (!source) return [];
    const tagSet = new Set(source.tags);
    return mockBlogStore
      .list()
      .filter(
        (p) =>
          p.id !== source.id &&
          p.status === "PUBLISHED" &&
          (p.category === source.category || p.tags.some((t) => tagSet.has(t))),
      )
      .slice(0, limit);
  },
  async adminList(filters: BlogFilters = {}): Promise<BlogListResponse> {
    return buildMockListResponse({ ...filters, status: filters.status });
  },
};

function filtersToQuery(filters: BlogFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.tag) params.tag = filters.tag;
  if (filters.status) params.status = filters.status;
  if (filters.authorId) params.authorId = filters.authorId;
  if (filters.featured) params.featured = "true";
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  return params;
}

async function tryRealOrMock<T>(
  real: () => Promise<T>,
  mock: () => Promise<T>,
): Promise<T> {
  if (shouldUseMockByDefault()) return mock();
  try {
    return await real();
  } catch (error) {
    if (isMissingEndpoint(error)) return mock();
    throw error;
  }
}

export const blogsApi = {
  list(filters: BlogFilters = {}): Promise<BlogListResponse> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.get<BlogListResponse>("/blogs", {
          params: filtersToQuery(filters),
        });
        return data;
      },
      () => mockApi.list(filters),
    );
  },
  getBySlug(slug: string): Promise<BlogPost | null> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.get<BlogPost>(`/blogs/slug/${slug}`);
        return data;
      },
      () => mockApi.getBySlug(slug),
    );
  },
  getById(id: string): Promise<BlogPost | null> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.get<BlogPost>(`/blogs/${id}`);
        return data;
      },
      () => mockApi.getById(id),
    );
  },
  create(dto: CreateBlogDto): Promise<BlogPost> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.post<BlogPost>("/blogs", dto);
        return data;
      },
      () => mockApi.create(dto),
    );
  },
  update(id: string, dto: UpdateBlogDto): Promise<BlogPost> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.patch<BlogPost>(`/blogs/${id}`, dto);
        return data;
      },
      () => mockApi.update(id, dto),
    );
  },
  remove(id: string): Promise<void> {
    return tryRealOrMock(
      async () => {
        await apiClient.delete(`/blogs/${id}`);
      },
      () => mockApi.remove(id),
    );
  },
  publish(id: string): Promise<BlogPost> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.post<BlogPost>(`/blogs/${id}/publish`);
        return data;
      },
      () => mockApi.publish(id),
    );
  },
  unpublish(id: string): Promise<BlogPost> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.post<BlogPost>(`/blogs/${id}/unpublish`);
        return data;
      },
      () => mockApi.unpublish(id),
    );
  },
  archive(id: string): Promise<BlogPost> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.post<BlogPost>(`/blogs/${id}/archive`);
        return data;
      },
      () => mockApi.archive(id),
    );
  },
  feature(id: string, featured: boolean): Promise<BlogPost> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.post<BlogPost>(`/blogs/${id}/feature`, {
          featured,
        });
        return data;
      },
      () => mockApi.feature(id, featured),
    );
  },
  related(slug: string, limit = 3): Promise<BlogPost[]> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.get<BlogPost[]>(`/blogs/related/${slug}`, {
          params: { limit },
        });
        return data;
      },
      () => mockApi.related(slug, limit),
    );
  },
  adminList(filters: BlogFilters = {}): Promise<BlogListResponse> {
    return tryRealOrMock(
      async () => {
        const { data } = await apiClient.get<BlogListResponse>("/admin/blogs", {
          params: filtersToQuery(filters),
        });
        return data;
      },
      () => mockApi.adminList(filters),
    );
  },
};
