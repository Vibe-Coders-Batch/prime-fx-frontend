import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import { BLOG_POSTS, INSTRUCTOR_COURSES, coursesResponse } from "./support/fixtures";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "INSTRUCTOR" });
});

test.describe("instructor", () => {
    test("dashboard states totals and lists recent courses", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto("/instructor/dashboard");

        await expect(page.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();

        const totals = page.getByRole("region", { name: /Your totals/ });
        await expect(totals).toContainText("1,284");
        await expect(totals).toContainText("AED 84,250.75");

        const recent = page.getByRole("region", { name: /Recent courses/ });
        await expect(recent.getByRole("listitem")).toHaveCount(2);
        await expect(recent).toContainText("Applied SQL for Analysts");
        await expect(recent).toContainText("Published");
        await expect(recent).toContainText("612 students");

        expect(api.unmatched).toEqual([]);
    });

    test("dashboard offers delete only on drafts", async ({ page }) => {
        await mockApi(page);
        await page.goto("/instructor/dashboard");

        const recent = page.getByRole("region", { name: /Recent courses/ });
        await expect(
            recent.getByRole("button", { name: "Delete Forecasting in Practice" }),
        ).toBeVisible();
        await expect(
            recent.getByRole("button", { name: "Delete Applied SQL for Analysts" }),
        ).toHaveCount(0);
    });

    test("quick actions point at the right routes", async ({ page }) => {
        await mockApi(page);
        await page.goto("/instructor/dashboard");

        const actions = page.getByRole("complementary", { name: "Quick actions" });
        await expect(actions.getByRole("link", { name: /Create New Course/ })).toHaveAttribute(
            "href",
            "/instructor/courses/new",
        );
        await expect(actions.getByRole("link", { name: /View All Videos/ })).toHaveAttribute(
            "href",
            "/instructor/videos",
        );
    });

    test("course list shows the real submission state for each course", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse(INSTRUCTOR_COURSES as never) });
        await page.goto("/instructor/courses");

        await expect(page.getByRole("heading", { name: "My courses", level: 1 })).toBeVisible();

        const cards = page.getByRole("listitem");
        await expect(cards).toHaveCount(INSTRUCTOR_COURSES.length);
        await expect(cards.filter({ hasText: "Applied SQL" })).toContainText("Published");
        await expect(cards.filter({ hasText: "Forecasting" })).toContainText("Changes requested");
        await expect(cards.filter({ hasText: "Cohort Analytics" })).toContainText("Under review");
    });

    test("course list surfaces reviewer feedback on a rejected submission", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse(INSTRUCTOR_COURSES as never) });
        await page.goto("/instructor/courses");

        const card = page.getByRole("listitem").filter({ hasText: "Forecasting" });
        await expect(card).toContainText("Admin feedback:");
        await expect(card).toContainText("re-record module 2");
    });

    test("course list gates Analytics and Delete by review state", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse(INSTRUCTOR_COURSES as never) });
        await page.goto("/instructor/courses");

        // Approved: analytics available, no delete.
        const approved = page.getByRole("listitem").filter({ hasText: "Applied SQL" });
        await expect(approved.getByRole("link", { name: /^Analytics/ })).toHaveAttribute(
            "href",
            "/instructor/courses/course-sql/analytics",
        );
        await expect(approved.getByRole("button", { name: /^Delete/ })).toHaveCount(0);

        // Pending review: neither analytics nor delete.
        const pending = page.getByRole("listitem").filter({ hasText: "Cohort Analytics" });
        await expect(pending.getByRole("link", { name: /^Analytics/ })).toHaveCount(0);
        await expect(pending.getByRole("button", { name: /^Delete/ })).toHaveCount(0);

        // Changes requested: deletable.
        const draft = page.getByRole("listitem").filter({ hasText: "Forecasting" });
        await expect(draft.getByRole("button", { name: /^Delete/ })).toBeVisible();
    });

    test("course analytics rounds the real performance figures", async ({ page }) => {
        await mockApi(page);
        await page.goto("/instructor/courses/course-sql/analytics");

        await expect(
            page.getByRole("heading", { name: /Course analytics/, level: 1 }),
        ).toBeVisible();
        await expect(page.getByText("612", { exact: true })).toBeVisible();
        await expect(page.getByText("39.9%")).toBeVisible();
        await expect(page.getByText("57.4%")).toBeVisible();
        await expect(page.getByText("244", { exact: true })).toBeVisible();
    });

    test("videos list groups lessons by course and gates preview on readiness", async ({
        page,
    }) => {
        await mockApi(page, { courses: coursesResponse(INSTRUCTOR_COURSES as never) });
        await page.goto("/instructor/videos");

        await expect(page.getByRole("heading", { name: "My videos", level: 1 })).toBeVisible();

        const card = page.getByRole("listitem").filter({ hasText: "Naive forecasts" });
        await expect(card).toHaveCount(1);
        await expect(card).toContainText("Forecasting in Practice");
        await expect(card).toContainText("Baselines");
        await expect(card).toContainText("Ready");
        await expect(card.getByRole("button", { name: /Preview/ })).toBeEnabled();

        // A TEXT lesson is not a video and must not appear at all.
        await expect(
            page.getByRole("listitem").filter({ hasText: "Reading the residuals" }),
        ).toHaveCount(0);
    });

    test("blog list separates drafts from published posts", async ({ page }) => {
        await mockApi(page);
        await page.goto("/instructor/blogs");

        await expect(page.getByRole("heading", { name: "Blog posts", level: 1 })).toBeVisible();

        const posts = page.getByRole("listitem");
        await expect(posts).toHaveCount(BLOG_POSTS.length);

        const published = posts.filter({ hasText: "Reading a query plan" });
        await expect(published).toContainText("Featured");
        await expect(published.getByRole("link", { name: /View/ })).toHaveAttribute(
            "href",
            "/blogs/reading-a-query-plan",
        );

        // A draft has no public link to view.
        const draft = posts.filter({ hasText: "Notes on sampling" });
        await expect(draft.getByRole("link", { name: /View/ })).toHaveCount(0);
        await expect(draft.getByRole("link", { name: /Edit/ })).toHaveAttribute(
            "href",
            "/instructor/blogs/post-2/edit",
        );
    });

    test("profile keeps email and role locked", async ({ page }) => {
        await mockApi(page);
        await page.goto("/instructor/profile");

        await expect(page.getByRole("heading", { name: "Settings", level: 1 })).toBeVisible();
        await expect(page.getByRole("textbox", { name: "Email" })).toBeDisabled();
        await expect(page.getByRole("textbox", { name: "Role" })).toBeDisabled();
        await expect(page.getByRole("textbox", { name: "First Name" })).toBeEnabled();
    });

    test("fits a 320px viewport without horizontal scroll", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse(INSTRUCTOR_COURSES as never) });
        await page.setViewportSize({ width: 320, height: 720 });
        await page.goto("/instructor/courses");
        await expect(page.getByRole("heading", { name: "My courses", level: 1 })).toBeVisible();

        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });
});
