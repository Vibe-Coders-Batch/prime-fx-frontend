import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import { COURSE_CATALOGUE } from "./support/fixtures";

const URL = "/learner/courses/course-sql";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
});

test.describe("learner course detail", () => {
    test("shows price, comparison price and the derived discount", async ({ page }) => {
        const api = await mockApi(page, { course: COURSE_CATALOGUE });
        await page.goto(URL);

        const panel = page.getByRole("complementary", { name: "Enrolment" });
        await expect(panel).toContainText("AED 249.00");
        await expect(panel).toContainText("AED 399.00");
        // 249 off 399 rounds to 38%.
        await expect(panel).toContainText("38% off");
        expect(api.unmatched).toEqual([]);
    });

    test("offers purchase actions when the learner is not enrolled", async ({ page }) => {
        await mockApi(page, { course: COURSE_CATALOGUE });
        await page.goto(URL);

        const panel = page.getByRole("complementary", { name: "Enrolment" });
        await expect(panel.getByRole("button", { name: "Add to cart" })).toBeVisible();
        await expect(panel.getByRole("button", { name: "Buy now" })).toBeVisible();
        await expect(panel.getByRole("button", { name: "Go to Course" })).toHaveCount(0);
    });

    test("switches to the player action once enrolled", async ({ page }) => {
        await mockApi(page, {
            course: COURSE_CATALOGUE,
            checkAccess: { isEnrolled: true, enrollmentId: "enr-1" },
        });
        await page.goto(URL);

        const panel = page.getByRole("complementary", { name: "Enrolment" });
        await expect(panel.getByRole("button", { name: "Go to Course" })).toBeVisible();
        await expect(panel.getByRole("button", { name: "Add to cart" })).toHaveCount(0);
    });

    test("locks lessons the learner has not bought, in text as well as colour", async ({ page }) => {
        await mockApi(page, { course: COURSE_CATALOGUE });
        await page.goto(URL);

        const content = page.getByRole("region", { name: /Course content/ });
        const lesson = content.locator("ol ol > li").filter({ hasText: "Why SQL still wins" });
        await expect(lesson).toContainText("locked");
    });

    test("offers a per-section purchase only where one is configured", async ({ page }) => {
        await mockApi(page, { course: COURSE_CATALOGUE });
        await page.goto(URL);

        const content = page.getByRole("region", { name: /Course content/ });
        const sections = content.locator("ol").first().locator("> li");

        await expect(sections.nth(0)).toContainText("AED 79.00");
        await expect(
            sections.nth(0).getByRole("button", { name: /Buy Section/ }),
        ).toBeVisible();
        // The second section is bundle-only, so it carries no separate price.
        await expect(sections.nth(1).getByRole("button", { name: /Buy Section/ })).toHaveCount(0);
    });

    test("marks an already-owned section as owned", async ({ page }) => {
        await mockApi(page, {
            course: { ...COURSE_CATALOGUE, accessibleSectionIds: ["s1"] },
        });
        await page.goto(URL);

        const content = page.getByRole("region", { name: /Course content/ });
        const first = content.locator("ol").first().locator("> li").nth(0);
        await expect(first).toContainText("Owned");
        await expect(first.getByRole("button", { name: /Buy Section/ })).toHaveCount(0);
    });

    test("states only facts the curriculum actually supports", async ({ page }) => {
        await mockApi(page, { course: COURSE_CATALOGUE });
        await page.goto(URL);

        // Lesson count and duration come from the sections themselves.
        await expect(page.getByText("5 lessons").first()).toBeVisible();

        // Regression guard: the page used to hardcode a rating, a review
        // count, a student count and a "Bestseller" badge for every course.
        const body = await page.locator("body").innerText();
        expect(body).not.toContain("Bestseller");
        expect(body).not.toContain("1,234 ratings");
        expect(body).not.toContain("12,345 students");
        expect(body).not.toMatch(/\b4\.6\b/);
    });
});
