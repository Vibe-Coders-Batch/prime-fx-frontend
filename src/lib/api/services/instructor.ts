import { apiClient } from "@/lib/api/client";

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  recentCourses: any[]; // refine type if needed
}

export interface InstructorCoursesResponse {
    data: any[]; // refine type
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export const instructorService = {
  getStats: async (): Promise<InstructorStats> => {
    const { data } = await apiClient.get<InstructorStats>("/instructor/stats");
    return data;
  },

  getCourses: async (page = 1, limit = 10): Promise<InstructorCoursesResponse> => {
    const { data } = await apiClient.get<InstructorCoursesResponse>("/instructor/courses", {
        params: { page, limit }
    });
    return data;
  },
};
