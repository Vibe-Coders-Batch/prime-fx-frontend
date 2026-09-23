import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import { ADMIN_COURSES, coursesResponse } from "./support/fixtures";

const URL = "/admin/courses";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
});

test.describe("training operations — courses", () => {
    test("lists courses in a semantic table with every column intact", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto(URL);

        await expect(
            page.getByRole("heading", { name: "Course management", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        for (const header of [
            "Title",
            "Category",
            "Instructor",
            "Status",
            "Review status",
            "Price",
            "Created",
            "Actions",
        ]) {
            await expect(
                table.getByRole("columnheader", { name: header, exact: true }),
            ).toBeVisible();
        }
        await expect(table.getByRole("row")).toHaveCount(ADMIN_COURSES.length + 1);
        expect(api.unmatched).toEqual([]);
    });

    test("shows status and review status as readable labels", async ({ page }) => {
        await mockApi(page);
        await page.goto(URL);
        const table = page.getByRole("table");

        const published = table.getByRole("row", { name: /Applied SQL for Analysts/ });
        await expect(published).toContainText("Published");
        await expect(published).toContainText("Approved");

        const draft = table.getByRole("row", { name: /Forecasting in Practice/ });
        await expect(draft).toContainText("Draft");
        await expect(draft).toContainText("Pending review");

        const archived = table.getByRole("row", { name: /Legacy Reporting Tools/ });
        await expect(archived).toContainText("Archived");
        await expect(archived).toContainText("Changes requested");
    });

    test("keeps price, instructor and category exactly as before", async ({ page }) => {
        await mockApi(page);
        await page.goto(URL);
        const table = page.getByRole("table");

        const row = table.getByRole("row", { name: /Applied SQL for Analysts/ });
        await expect(row).toContainText("AED 249.00");
        await expect(row).toContainText("Riya Kapoor");
        await expect(row).toContainText("Data & Analytics");

        // Instructor with no name falls back to the email, as it always has.
        await expect(table.getByRole("row", { name: /Forecasting in Practice/ })).toContainText(
            "sam@example.test",
        );
        // Missing category and instructor both keep the N/A placeholder.
        await expect(table.getByRole("row", { name: /Legacy Reporting Tools/ })).toContainText(
            "N/A",
        );
    });

    test("keeps both row actions pointing at the course detail route", async ({ page }) => {
        await mockApi(page);
        await page.goto(URL);

        const row = page.getByRole("table").getByRole("row", { name: /Applied SQL for Analysts/ });
        await expect(row.getByRole("link", { name: /^View/ })).toHaveAttribute(
            "href",
            "/admin/courses/course-sql",
        );
        await expect(row.getByRole("link", { name: /^Review/ })).toHaveAttribute(
            "href",
            "/admin/courses/course-sql",
        );
    });

    test("status filter reaches the API unchanged", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto(URL);
        await expect(page.getByRole("table")).toBeVisible();

        await page.getByRole("combobox", { name: "Filter courses by status" }).click();
        await page.getByRole("option", { name: "Draft" }).click();

        await expect
            .poll(() =>
                api.requests.some((r) => r.startsWith("/courses?") && r.includes("status=DRAFT")),
            )
            .toBe(true);
    });

    test("swaps to labelled records at 320px so both actions stay reachable", async ({ page }) => {
        await mockApi(page);
        await page.setViewportSize({ width: 320, height: 720 });
        await page.goto(URL);

        await expect(page.getByRole("table")).toBeHidden();

        const record = page.getByRole("listitem").filter({ hasText: "Applied SQL for Analysts" });
        await expect(record).toHaveCount(1);
        await expect(record).toContainText("AED 249.00");
        await expect(record.getByRole("link", { name: /^View/ })).toBeVisible();
        await expect(record.getByRole("link", { name: /^Review/ })).toBeVisible();

        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });

    test("keeps the empty state and its explanation", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse([]) });
        await page.goto(URL);

        await expect(page.getByRole("heading", { name: "No courses found" })).toBeVisible();
        await expect(
            page.getByText("Courses will appear here once instructors create them."),
        ).toBeVisible();
    });
});
