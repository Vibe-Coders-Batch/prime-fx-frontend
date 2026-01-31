import { apiClient } from "../client";
export interface Category {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
}
export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const { data } = await apiClient.get("/categories");
        return data;
    },
    getById: async (id: string): Promise<Category> => {
        const { data } = await apiClient.get(`/categories/${id}`);
        return data;
    },
    getBySlug: async (slug: string): Promise<Category> => {
        const { data } = await apiClient.get(`/categories/slug/${slug}`);
        return data;
    },
};
