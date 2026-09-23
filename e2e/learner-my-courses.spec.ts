import { expect, test, type Page } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import { ENROLMENTS, enrolmentsResponse } from "./support/fixtures";

/**
 * Direct children only: a section-access record nests its own list of
 * purchased sections, which would otherwise be counted as records.
 */
function enrolmentRecords(page: Page) {
    return page
        .getByRole("region", { name: /Enrolled courses/ })
        .locator("ul")
        .first()
        .locator("> li");
}

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
});

test.describe("learner enrolment list", () => {
    test("renders every enrolment as a record with its real status", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto("/learner/my-courses");

        await expect(page.getByRole("heading", { name: "My courses", level: 1 })).toBeVisible();

        const records = enrolmentRecords(page);
        await expect(records).toHaveCount(ENROLMENTS.length);

        // Status labels are sentence case and never colour-only.
        await expect(records.filter({ hasText: "Statistics Foundations" })).toContainText(
            "In progress",
        );
        await expect(records.filter({ hasText: "Data Visualisation Practice" })).toContainText(
            "Completed",
        );
        await expect(records.filter({ hasText: "Machine Learning Primer" })).toContainText(
            "Revoked",
        );

        // Each record keeps its existing action and target.
        await expect(
            records
                .filter({ hasText: "Data Visualisation Practice" })
                .getByRole("link", { name: /Review course/ }),
        ).toHaveAttribute("href", "/learner/courses/course-viz/watch");

        expect(api.unmatched).toEqual([]);
    });

    test("does not offer to resume a revoked enrolment", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/my-courses");

        const revoked = enrolmentRecords(page).filter({ hasText: "Machine Learning Primer" });
        await expect(revoked).toContainText("Revoked");
        // Access is gone, so there is no player to resume.
        await expect(revoked.getByRole("link", { name: /Resume course/ })).toHaveCount(0);
        await expect(revoked.getByRole("link", { name: /View course/ })).toHaveAttribute(
            "href",
            "/learner/courses/course-ml",
        );
    });

    test("reports a revoked section purchase as revoked, not as section access", async ({
        page,
    }) => {
        await mockApi(page);
        await page.goto("/learner/my-courses");

        const record = enrolmentRecords(page).filter({ hasText: "Audit Analytics" });
        await expect(record).toContainText("Revoked");
        await expect(record).not.toContainText("Section access");
        await expect(record.getByRole("link", { name: /Watch section/ })).toHaveCount(0);
        await expect(record.getByRole("link", { name: /View course/ })).toBeVisible();
    });

    test("leads with the most recent active enrolment", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/my-courses");

        const lead = page.getByRole("region", { name: "Most recent enrolment" });
        await expect(lead).toContainText("Applied SQL for Analysts");
        // The newest active enrolment wins, not simply the first in the payload.
        await expect(lead).not.toContainText("Statistics Foundations");
        await expect(lead.getByRole("link", { name: /Resume course/ })).toHaveAttribute(
            "href",
            "/learner/courses/course-sql/watch",
        );
    });

    test("surfaces section access with the sections that were purchased", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/my-courses");

        const record = enrolmentRecords(page).filter({ hasText: "Spreadsheet Modelling" });

        await expect(record).toContainText("Section access");
        await expect(record).toContainText("Access to 4 sections");
        await expect(record).toContainText("Pivot tables");
        // Only the first three are listed, the rest are summarised.
        await expect(record).toContainText("+ 1 more");
        await expect(record.getByRole("link", { name: /Watch section/ })).toBeVisible();
    });

    test("search narrows the list and explains an empty result", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/my-courses");

        const search = page.getByRole("textbox", { name: "Search your courses by title" });
        await search.fill("statistics");

        const records = enrolmentRecords(page);
        await expect(records).toHaveCount(1);
        await expect(records.first()).toContainText("Statistics Foundations");

        // Previously this combination rendered an empty grid with no explanation.
        await search.fill("no such course");
        await expect(page.getByText("No courses match your search.")).toBeVisible();
        await expect(page.getByRole("button", { name: "Browse Courses" })).toHaveCount(0);
    });

    test("status filter reaches the API unchanged", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto("/learner/my-courses");
        await expect(page.getByRole("region", { name: /Enrolled courses/ })).toBeVisible();

        await page.getByRole("combobox", { name: "Filter courses by status" }).click();
        await page.getByRole("option", { name: "Completed" }).click();

        await expect
            .poll(() => api.requests.some((r) => r.startsWith("/enrollments?") && r.includes("status=COMPLETED")))
            .toBe(true);
    });

    test("empty state keeps the existing browse action", async ({ page }) => {
        await mockApi(page, { enrollments: enrolmentsResponse([]) });
        await page.goto("/learner/my-courses");

        await expect(page.getByRole("heading", { name: "No courses found" })).toBeVisible();
        await expect(
            page.getByText("Start your learning journey by enrolling in a course."),
        ).toBeVisible();
        await expect(page.getByRole("button", { name: "Browse Courses" })).toBeVisible();
    });

    test("fits a 320px viewport without horizontal scroll", async ({ page }) => {
        await mockApi(page);
        await page.setViewportSize({ width: 320, height: 720 });
        await page.goto("/learner/my-courses");
        await expect(page.getByRole("region", { name: /Enrolled courses/ })).toBeVisible();

        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });
});
