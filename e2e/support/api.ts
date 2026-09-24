import type { Page, Route } from "@playwright/test";
import {
    ADMIN_COMPANIES,
    BLOG_POSTS,
    COMPANY_DETAIL,
    COURSE_PERFORMANCE,
    INSTRUCTOR_STATS,
    PROFILE,
    blogsResponse,
    adminCategoriesResponse,
    adminCouponsResponse,
    ENROLLMENT_STATS,
    ENROLLMENT_TREND,
    PLATFORM_STATS,
    REVENUE_STATS,
    REVENUE_TREND,
    TOP_COURSES,
    CATEGORIES,
    COURSE_SQL,
    PROGRESS_SQL,
    adminEnrolmentsResponse,
    coursesResponse,
    enrolmentsResponse,
    paymentsResponse,
    usersResponse,
} from "./fixtures";

/** 1x1 transparent PNG, so SecureImage resolves without touching storage. */
const PIXEL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export interface ApiOverrides {
    enrollments?: unknown;
    instructorStats?: unknown;
    blogs?: unknown;
    coursePerformance?: unknown;
    company?: unknown;
    profile?: unknown;
    adminCategories?: unknown;
    adminCoupons?: unknown;
    checkAccess?: unknown;
    users?: unknown;
    payments?: unknown;
    companies?: unknown;
    courses?: unknown;
    course?: unknown;
    progress?: unknown;
    categories?: unknown;
}

export interface ApiRecorder {
    /** Every intercepted request path + query, in order. */
    requests: string[];
    /** Paths the mock did not recognise; assert this stays empty. */
    unmatched: string[];
}

const has = (o: ApiOverrides, k: keyof ApiOverrides) => Object.prototype.hasOwnProperty.call(o, k);

function json(route: Route, body: unknown, status = 200) {
    return route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
    });
}

/**
 * Intercepts the app's `/api/*` calls (the Next rewrite target) and answers
 * them from fixtures, so the redesigned screens render without a backend.
 */
export async function mockApi(page: Page, overrides: ApiOverrides = {}): Promise<ApiRecorder> {
    const recorder: ApiRecorder = { requests: [], unmatched: [] };

    await page.route("**/api/**", async (route) => {
        const url = new URL(route.request().url());
        const path = url.pathname.replace(/^\/api/, "");
        recorder.requests.push(`${path}${url.search}`);

        if (path.startsWith("/files/storage/download-url")) {
            return json(route, { url: PIXEL });
        }
        if (path.startsWith("/enrollments/check-access/")) {
            return json(
                route,
                has(overrides, "checkAccess") ? overrides.checkAccess : { isEnrolled: false },
            );
        }
        if (path === "/enrollments") {
            return json(route, has(overrides, "enrollments") ? overrides.enrollments : enrolmentsResponse());
        }
        if (path === "/courses") {
            return json(route, has(overrides, "courses") ? overrides.courses : coursesResponse());
        }
        if (path === "/users") {
            return json(route, has(overrides, "users") ? overrides.users : usersResponse());
        }
        if (path === "/payments") {
            return json(route, has(overrides, "payments") ? overrides.payments : paymentsResponse());
        }
        if (path === "/companies") {
            return json(route, has(overrides, "companies") ? overrides.companies : ADMIN_COMPANIES);
        }
        if (path === "/instructor/stats") {
            return json(
                route,
                has(overrides, "instructorStats") ? overrides.instructorStats : INSTRUCTOR_STATS,
            );
        }
        if (path === "/blogs" || path === "/admin/blogs") {
            return json(route, has(overrides, "blogs") ? overrides.blogs : blogsResponse());
        }
        if (/^\/blogs\/[^/]+$/.test(path)) {
            return json(route, BLOG_POSTS[0]);
        }
        if (/^\/analytics\/courses\/[^/]+$/.test(path)) {
            return json(
                route,
                has(overrides, "coursePerformance")
                    ? overrides.coursePerformance
                    : COURSE_PERFORMANCE,
            );
        }
        if (/^\/companies\/[^/]+$/.test(path)) {
            return json(route, has(overrides, "company") ? overrides.company : COMPANY_DETAIL);
        }
        if (/^\/users\/[^/]+$/.test(path)) {
            return json(route, has(overrides, "profile") ? overrides.profile : PROFILE);
        }
        if (path === "/admin/categories") {
            return json(
                route,
                has(overrides, "adminCategories")
                    ? overrides.adminCategories
                    : adminCategoriesResponse(),
            );
        }
        if (path === "/admin/coupons") {
            return json(
                route,
                has(overrides, "adminCoupons") ? overrides.adminCoupons : adminCouponsResponse(),
            );
        }
        if (path === "/analytics/platform") {
            return json(route, PLATFORM_STATS);
        }
        if (path === "/analytics/revenue") {
            return json(route, REVENUE_STATS);
        }
        if (path === "/analytics/enrollments") {
            return json(route, ENROLLMENT_STATS);
        }
        if (path === "/analytics/enrollment-trend") {
            return json(route, ENROLLMENT_TREND);
        }
        if (path === "/analytics/revenue-trend") {
            return json(route, REVENUE_TREND);
        }
        if (path === "/analytics/top-courses") {
            return json(route, TOP_COURSES);
        }
        if (path === "/categories") {
            return json(route, has(overrides, "categories") ? overrides.categories : CATEGORIES);
        }
        if (/^\/progress\/courses\/[^/]+$/.test(path)) {
            return json(route, has(overrides, "progress") ? overrides.progress : PROGRESS_SQL);
        }
        if (/^\/courses\/[^/]+$/.test(path)) {
            return json(route, has(overrides, "course") ? overrides.course : COURSE_SQL);
        }

        recorder.unmatched.push(path);
        return json(route, { message: `not mocked: ${path}` }, 404);
    });

    return recorder;
}

/** Admin screens share the same router but different list payloads. */
export function adminApi(page: Page, overrides: ApiOverrides = {}) {
    return mockApi(page, { enrollments: adminEnrolmentsResponse(), ...overrides });
}
