export const queryKeys = {
    analytics: {
        all: () => ["analytics"] as const,
        enrollmentStats: (filters?: {
            startDate?: string | Date;
            endDate?: string | Date;
        }) => [...queryKeys.analytics.all(), "getEnrollmentStats", filters] as const,
        revenueStats: (filters?: {
            startDate?: string | Date;
            endDate?: string | Date;
        }) => [...queryKeys.analytics.all(), "getRevenueStats", filters] as const,
        instructorRevenueStats: (filters?: {
            startDate?: string | Date;
            endDate?: string | Date;
        }) => [...queryKeys.analytics.all(), "getInstructorRevenueStats", filters] as const,
        coursePerformance: (courseId?: string) => [...queryKeys.analytics.all(), "getCoursePerformance", courseId] as const,
        platformStats: () => [...queryKeys.analytics.all(), "getPlatformStats"] as const,
        enrollmentTrend: (filters?: {
            period?: "day" | "week" | "month";
            days?: number;
            startDate?: string | Date;
            endDate?: string | Date;
        }) => [...queryKeys.analytics.all(), "getEnrollmentTrend", filters] as const,
        revenueTrend: (filters?: {
            period?: "day" | "week" | "month";
            days?: number;
            startDate?: string | Date;
            endDate?: string | Date;
        }) => [...queryKeys.analytics.all(), "getRevenueTrend", filters] as const,
        topCourses: (filters?: {
            limit?: number;
            startDate?: string | Date;
            endDate?: string | Date;
        }) => [...queryKeys.analytics.all(), "getTopCourses", filters] as const,
    },
    categories: {
        all: () => ["categories"] as const,
        list: () => [...queryKeys.categories.all(), "getAll"] as const,
        detail: (id?: string) => [...queryKeys.categories.all(), "getById", id] as const,
        bySlug: (slug?: string) => [...queryKeys.categories.all(), "getBySlug", slug] as const,
    },
    companies: {
        all: () => ["companies"] as const,
        list: (filters?: {
            search?: string;
            page?: number;
            limit?: number;
        }) => [...queryKeys.companies.all(), "getAll", filters] as const,
        detail: (id?: string) => [...queryKeys.companies.all(), "getById", id] as const,
    },
    courses: {
        all: () => ["courses"] as const,
        list: (filters?: any) => [...queryKeys.courses.all(), "getAll", filters] as const,
        detail: (id?: string) => [...queryKeys.courses.all(), "getById", id] as const,
        bySlug: (slug?: string) => [...queryKeys.courses.all(), "getBySlug", slug] as const,
    },
    dashboard: {
        all: () => ["dashboard"] as const,
        stats: (userId?: string) => [...queryKeys.dashboard.all(), "stats", userId] as const,
    },
    enrollments: {
        all: () => ["enrollments"] as const,
        list: (filters?: {
            userId?: string;
            courseId?: string;
            companyId?: string;
            status?: string;
            page?: number;
            limit?: number;
        }) => [...queryKeys.enrollments.all(), "getAll", filters] as const,
        detail: (id?: string) => [...queryKeys.enrollments.all(), "getById", id] as const,
    },
    payments: {
        all: () => ["payments"] as const,
        list: (filters?: {
            search?: string;
            page?: number;
            limit?: number;
        }) => [...queryKeys.payments.all(), filters] as const,
    },
    cart: {
        all: () => ["cart"] as const,
        list: () => [...queryKeys.cart.all(), "list"] as const,
    },
    progress: {
        all: () => ["progress"] as const,
        courseProgress: (courseId?: string) => [...queryKeys.progress.all(), "getCourseProgress", courseId] as const,
    },
    users: {
        all: () => ["users"] as const,
        list: (filters?: any) => [...queryKeys.users.all(), "getAll", filters] as const,
        detail: (id?: string) => [...queryKeys.users.all(), "getById", id] as const,
    },
    lessons: {
        all: () => ["lessons"] as const,
        detail: (id?: string) => [...queryKeys.lessons.all(), "getById", id] as const,
    },
    sections: {
        all: () => ["sections"] as const,
        list: (courseId?: string) => [...queryKeys.sections.all(), "getAll", courseId] as const,
        detail: (id?: string) => [...queryKeys.sections.all(), "getById", id] as const,
    },
    auth: {
        all: () => ["auth"] as const,
        profile: () => [...queryKeys.auth.all(), "profile"] as const,
    },
    storage: {
        all: () => ["storage"] as const,
    },
    instructor: {
        all: () => ["instructor"] as const,
        courses: (instructorId?: string) => [...queryKeys.instructor.all(), "courses", instructorId] as const,
    },
} as const;
