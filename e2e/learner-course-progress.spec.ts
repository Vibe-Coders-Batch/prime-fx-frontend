import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import { COURSE_SQL, PROGRESS_SQL } from "./support/fixtures";

const URL = "/learner/courses/course-sql/progress";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
});

test.describe("learner course workspace", () => {
    test("summarises real progress in the rail", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto(URL);

        await expect(
            page.getByRole("heading", { name: COURSE_SQL.title, level: 1 }),
        ).toBeVisible();
        await expect(page.getByText("Course progress", { exact: true }).first()).toBeVisible();

        const meter = page.getByRole("progressbar", { name: "Course progress" });
        await expect(meter).toHaveAttribute("aria-valuenow", "40");
        await expect(meter).toHaveAttribute("aria-valuetext", "40% complete");

        const rail = page.getByRole("complementary");
        await expect(rail).toContainText("2 of 5 lessons completed");
        await expect(rail).toContainText("40%");
        // 7860s of recorded time, rendered with the page's existing formatter.
        await expect(rail).toContainText("2h 11m");
        await expect(rail).toContainText("Last accessed");

        expect(api.unmatched).toEqual([]);
    });

    test("points at the first lesson that is not yet complete", async ({ page }) => {
        await mockApi(page);
        await page.goto(URL);

        const rail = page.getByRole("complementary");
        await expect(rail).toContainText("Up next");
        await expect(rail).toContainText("Filtering with WHERE");
        await expect(rail).toContainText("Shaping results");
        await expect(rail.getByRole("link", { name: "Continue course" })).toHaveAttribute(
            "href",
            "/learner/courses/course-sql/watch",
        );
    });

    test("labels the action from the learner's actual position", async ({ page }) => {
        await mockApi(page, {
            progress: { ...PROGRESS_SQL, progress: "0", lessonProgress: [] },
        });
        await page.goto(URL);
        await expect(
            page.getByRole("complementary").getByRole("link", { name: "Start course" }),
        ).toBeVisible();
    });

    test("treats a fully completed course as review", async ({ page }) => {
        const allDone = COURSE_SQL.sections
            .flatMap((s) => s.lessons)
            .map((lesson, i) => ({
                id: `done-${i}`,
                progressId: "prog-1",
                lessonId: lesson.lessonId,
                completed: true,
                timeSpent: 60,
                lastAccessed: "2026-09-18T16:20:00.000Z",
                updatedAt: "2026-09-18T16:20:00.000Z",
            }));
        await mockApi(page, {
            progress: { ...PROGRESS_SQL, progress: "100", lessonProgress: allDone },
        });
        await page.goto(URL);

        const rail = page.getByRole("complementary");
        await expect(rail).toContainText("5 of 5 lessons completed");
        await expect(rail).not.toContainText("Up next");
        await expect(rail.getByRole("link", { name: "Review course" })).toBeVisible();
    });

    test("keeps the curriculum ordered and marks completion for screen readers", async ({
        page,
    }) => {
        await mockApi(page);
        await page.goto(URL);

        const sections = page.locator("main ol").first().locator("> li");
        await expect(sections).toHaveCount(2);
        await expect(sections.nth(0)).toContainText("Getting your bearings");
        await expect(sections.nth(0)).toContainText("2/2 completed");
        await expect(sections.nth(1)).toContainText("Shaping results");
        await expect(sections.nth(1)).toContainText("0/3 completed");

        // Completion is conveyed in text, not only by the tick's colour.
        await expect(
            sections.nth(0).getByRole("listitem").filter({ hasText: "Why SQL still wins" }),
        ).toContainText("completed");
    });

    test("offers a way back to the enrolment list", async ({ page }) => {
        await mockApi(page);
        await page.goto(URL);
        await expect(
            page.getByRole("main").getByRole("link", { name: "My courses" }),
        ).toHaveAttribute("href", "/learner/my-courses");
    });

    test("puts status before curriculum in the reading order at every width", async ({ page }) => {
        await mockApi(page);
        await page.goto(URL);
        await expect(page.getByRole("complementary")).toBeVisible();

        const railFirst = await page.evaluate(() => {
            const rail = document.querySelector("aside");
            const curriculum = document.querySelector('[aria-labelledby="curriculum-heading"]');
            if (!rail || !curriculum) return null;
            return !!(
                rail.compareDocumentPosition(curriculum) & Node.DOCUMENT_POSITION_FOLLOWING
            );
        });
        expect(railFirst).toBe(true);
    });

    test("explains a missing course instead of rendering an empty shell", async ({ page }) => {
        await mockApi(page, { course: null });
        await page.goto(URL);
        await expect(page.getByRole("heading", { name: "Course not found" }).first()).toBeVisible();
    });
});
