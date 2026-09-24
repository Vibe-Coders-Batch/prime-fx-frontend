import { test } from "@playwright/test";
import { adminApi, mockApi } from "./support/api";
import { signIn } from "./support/session";

/**
 * Visual capture of the redesigned screens. Skipped by default so ordinary
 * runs stay fast; run with E2E_SHOTS=1 to regenerate.
 * Images land in design-shots/ (gitignored). Kept out of test-results/,
 * which Playwright wipes at the start of every run.
 */
test.skip(!process.env.E2E_SHOTS, "set E2E_SHOTS=1 to capture design screenshots");

const OUT = process.env.E2E_SHOTS_DIR ?? "design-shots";

async function useTheme(page: import("@playwright/test").Page, theme: "light" | "dark") {
    await page.addInitScript((t) => window.localStorage.setItem("theme", t), theme);
}

test("learner enrolment list", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/learner/my-courses");
    await page.getByRole("region", { name: /Enrolled courses/ }).waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/1-learner-my-courses.png`, fullPage: true });
});

test("learner course workspace", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/learner/courses/course-sql/progress");
    await page.getByRole("progressbar", { name: "Course progress" }).waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/2-learner-course-workspace.png`, fullPage: true });
});

test("operations enrolments", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
    await useTheme(page, "light");
    await adminApi(page);
    await page.goto("/admin/enrollments");
    await page.getByRole("table").waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/3-admin-enrolments.png`, fullPage: true });
});

test("operations courses", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/admin/courses");
    await page.getByRole("table").waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/4-admin-courses.png`, fullPage: true });
});

test("learner list on a narrow screen", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/learner/my-courses");
    await page.getByRole("region", { name: /Enrolled courses/ }).waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/5-learner-mobile.png`, fullPage: true });
});

test("operations enrolments on a narrow screen", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
    await useTheme(page, "light");
    await adminApi(page);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/admin/enrollments");
    await page.getByText("3 enrolments").waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/6-admin-mobile-records.png`, fullPage: true });
});

test("learner course workspace in dark mode", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
    await useTheme(page, "dark");
    await mockApi(page);
    await page.goto("/learner/courses/course-sql/progress");
    await page.getByRole("progressbar", { name: "Course progress" }).waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/7-learner-workspace-dark.png`, fullPage: true });
});

test("operations users", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/admin/users");
    await page.getByRole("table").waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/8-admin-users.png`, fullPage: true });
});

test("operations payments", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/admin/payments");
    await page.getByRole("table").waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/9-admin-payments.png`, fullPage: true });
});

test("learner course detail", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
    await useTheme(page, "light");
    const { COURSE_CATALOGUE } = await import("./support/fixtures");
    await mockApi(page, { course: COURSE_CATALOGUE });
    await page.goto("/learner/courses/course-sql");
    await page.getByRole("complementary", { name: "Enrolment" }).waitFor();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/10-learner-course-detail.png`, fullPage: true });
});

test("operations dashboard", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/admin/dashboard");
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/11-admin-dashboard.png`, fullPage: true });
});

test("learner catalogue", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/learner/courses");
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/12-learner-catalogue.png`, fullPage: true });
});

test("operations coupons", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/admin/coupons");
    await page.getByRole("table").waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/13-admin-coupons.png`, fullPage: true });
});

test("instructor dashboard", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "INSTRUCTOR" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/instructor/dashboard");
    await page.getByRole("region", { name: /Your totals/ }).waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/14-instructor-dashboard.png`, fullPage: true });
});

test("instructor courses", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "INSTRUCTOR" });
    await useTheme(page, "light");
    const { INSTRUCTOR_COURSES, coursesResponse } = await import("./support/fixtures");
    await mockApi(page, { courses: coursesResponse(INSTRUCTOR_COURSES as never) });
    await page.goto("/instructor/courses");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/15-instructor-courses.png`, fullPage: true });
});

test("corporate dashboard", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "CORPORATE_ADMIN" });
    await useTheme(page, "light");
    const { adminEnrolmentsResponse } = await import("./support/fixtures");
    await mockApi(page, { enrollments: adminEnrolmentsResponse() });
    await page.goto("/corporate/dashboard");
    await page.getByRole("region", { name: /Company totals/ }).waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/16-corporate-dashboard.png`, fullPage: true });
});

test("corporate settings", async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "CORPORATE_ADMIN" });
    await useTheme(page, "light");
    await mockApi(page);
    await page.goto("/corporate/settings");
    await page.getByRole("textbox", { name: /Company Name/ }).waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/17-corporate-settings.png`, fullPage: true });
});
