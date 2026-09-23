import { expect, test } from "@playwright/test";
import { adminApi } from "./support/api";
import { signIn } from "./support/session";
import { ADMIN_ENROLMENTS, adminEnrolmentsResponse } from "./support/fixtures";

const URL = "/admin/enrollments";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
});

test.describe("training operations — enrolments", () => {
    test("lists enrolments in a semantic table with every column intact", async ({ page }) => {
        const api = await adminApi(page);
        await page.goto(URL);

        await expect(
            page.getByRole("heading", { name: "Enrolment management", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        await expect(table).toBeVisible();
        for (const header of ["User", "Course", "Company", "Status", "Enrolled", "Actions"]) {
            await expect(table.getByRole("columnheader", { name: header })).toBeVisible();
        }

        const rows = table.getByRole("row");
        // One header row plus one row per enrolment.
        await expect(rows).toHaveCount(ADMIN_ENROLMENTS.length + 1);

        const lee = table.getByRole("row", { name: /Lee Learner/ });
        await expect(lee).toContainText("Applied SQL for Analysts");
        await expect(lee).toContainText("Northwind Ltd");
        await expect(lee).toContainText("Active");

        expect(api.unmatched).toEqual([]);
    });

    test("keeps the existing fallbacks for missing names and companies", async ({ page }) => {
        await adminApi(page);
        await page.goto(URL);

        const row = page.getByRole("table").getByRole("row", { name: /noname@example.test/ });
        // No first or last name: the email stands in, as it always has.
        await expect(row).toContainText("noname@example.test");
        await expect(row).toContainText("N/A");
        await expect(row).toContainText("Completed");
    });

    test("renders non-active statuses as problem states", async ({ page }) => {
        await adminApi(page);
        await page.goto(URL);
        await expect(
            page.getByRole("table").getByRole("row", { name: /Kim Patel/ }),
        ).toContainText("Revoked");
    });

    test("reports the result count", async ({ page }) => {
        await adminApi(page);
        await page.goto(URL);
        await expect(page.getByText(`${ADMIN_ENROLMENTS.length} enrolments`)).toBeVisible();
    });

    test("Manage still opens the enrolment editor", async ({ page }) => {
        await adminApi(page);
        await page.goto(URL);

        await page
            .getByRole("table")
            .getByRole("row", { name: /Lee Learner/ })
            .getByRole("button", { name: /Manage/ })
            .click();

        await expect(page.getByRole("dialog")).toBeVisible();
    });

    test("status filter reaches the API unchanged", async ({ page }) => {
        const api = await adminApi(page);
        await page.goto(URL);
        await expect(page.getByRole("table")).toBeVisible();

        await page.getByRole("combobox", { name: "Filter enrollments by status" }).click();
        await page.getByRole("option", { name: "Revoked" }).click();

        await expect
            .poll(() =>
                api.requests.some(
                    (r) => r.startsWith("/enrollments?") && r.includes("status=REVOKED"),
                ),
            )
            .toBe(true);
    });

    test("disables pagination at the ends of the range", async ({ page }) => {
        await adminApi(page, {
            enrollments: adminEnrolmentsResponse(ADMIN_ENROLMENTS, { totalPages: 3, page: 1 }),
        });
        await page.goto(URL);

        await expect(page.getByText("Page 1 of 3", { exact: true })).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Previous", exact: true }),
        ).toBeDisabled();
        await expect(page.getByRole("button", { name: "Next", exact: true })).toBeEnabled();
    });

    test("swaps to labelled records at 320px so Manage stays reachable", async ({ page }) => {
        await adminApi(page);
        await page.setViewportSize({ width: 320, height: 720 });
        await page.goto(URL);

        // The dense table would push the action off-screen at this width.
        await expect(page.getByRole("table")).toBeHidden();

        const records = page.getByRole("listitem").filter({ hasText: "Lee Learner" });
        await expect(records).toHaveCount(1);
        await expect(records).toContainText("Northwind Ltd");
        await expect(records).toContainText("Active");
        await expect(records.getByRole("button", { name: /Manage/ })).toBeVisible();

        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });

    test("keeps the empty state and its explanation", async ({ page }) => {
        await adminApi(page, { enrollments: adminEnrolmentsResponse([]) });
        await page.goto(URL);

        await expect(page.getByRole("heading", { name: "No enrollments found" })).toBeVisible();
        await expect(
            page.getByText("Enrollments will appear here once users enroll in courses."),
        ).toBeVisible();
    });
});
