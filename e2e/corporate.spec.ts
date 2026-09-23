import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import {
    ADMIN_ENROLMENTS,
    ADMIN_USERS,
    adminEnrolmentsResponse,
    usersResponse,
} from "./support/fixtures";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "CORPORATE_ADMIN" });
});

test.describe("corporate", () => {
    test("dashboard derives its totals from the company's own records", async ({ page }) => {
        const api = await mockApi(page, { enrollments: adminEnrolmentsResponse() });
        await page.goto("/corporate/dashboard");

        await expect(
            page.getByRole("heading", { name: "Corporate dashboard", level: 1 }),
        ).toBeVisible();

        const totals = page.getByRole("region", { name: /Company totals/ });
        await expect(totals).toContainText(String(ADMIN_USERS.length));
        // Fixture enrolments: one ACTIVE, one COMPLETED, one REVOKED.
        await expect(totals).toContainText("Active enrolments");
        await expect(totals).toContainText("Completed");
        // Three distinct courses across those enrolments.
        await expect(totals).toContainText("Courses assigned");

        expect(api.unmatched).toEqual([]);
    });

    test("dashboard breaks enrolments down by status", async ({ page }) => {
        await mockApi(page, { enrollments: adminEnrolmentsResponse() });
        await page.goto("/corporate/dashboard");

        const breakdown = page.getByRole("region", { name: /Enrolment status breakdown/ });
        await expect(breakdown).toContainText("Active");
        await expect(breakdown).toContainText("Completed");
    });

    test("user list keeps roles, verification state and the manage action", async ({ page }) => {
        await mockApi(page);
        await page.goto("/corporate/users");

        await expect(
            page.getByRole("heading", { name: "User management", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        await expect(table.getByRole("row")).toHaveCount(ADMIN_USERS.length + 1);

        const verified = table.getByRole("row", { name: /Riya Kapoor/ });
        await expect(verified).toContainText("Instructor");
        await expect(verified).toContainText("Active");

        const pending = table.getByRole("row", { name: /nameless@example.test/ });
        await expect(pending).toContainText("N/A");
        await expect(pending).toContainText("Pending");
        await expect(pending.getByRole("button", { name: /Manage/ })).toBeVisible();
    });

    test("user list empty state keeps its add action", async ({ page }) => {
        await mockApi(page, { users: usersResponse([]) });
        await page.goto("/corporate/users");

        await expect(page.getByRole("heading", { name: "No users found" })).toBeVisible();
        await expect(
            page.getByText("Add users to your company account to get started."),
        ).toBeVisible();
    });

    test("enrolment list shows status and supports the status filter", async ({ page }) => {
        const api = await mockApi(page, { enrollments: adminEnrolmentsResponse() });
        await page.goto("/corporate/enrollments");

        await expect(
            page.getByRole("heading", { name: "Bulk enrolment", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        await expect(table.getByRole("row")).toHaveCount(ADMIN_ENROLMENTS.length + 1);
        await expect(table.getByRole("row", { name: /Lee Learner/ })).toContainText("Active");
        await expect(table.getByRole("row", { name: /Kim Patel/ })).toContainText("Revoked");

        await page.getByRole("combobox", { name: "Filter enrollments by status" }).click();
        await page.getByRole("option", { name: "Completed" }).click();

        await expect
            .poll(() =>
                api.requests.some(
                    (r) => r.startsWith("/enrollments?") && r.includes("status=COMPLETED"),
                ),
            )
            .toBe(true);
    });

    test("enrolment search narrows by learner and by course", async ({ page }) => {
        await mockApi(page, { enrollments: adminEnrolmentsResponse() });
        await page.goto("/corporate/enrollments");
        await expect(page.getByRole("table")).toBeVisible();

        const search = page.getByRole("textbox", { name: "Search enrollments" });
        await search.fill("kim");
        await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);

        await search.fill("visualisation");
        await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
    });

    test("settings load the company's real details into the form", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto("/corporate/settings");

        await expect(
            page.getByRole("heading", { name: "Corporate settings", level: 1 }),
        ).toBeVisible();

        await expect(page.getByRole("textbox", { name: /Company Name/ })).toHaveValue(
            "Northwind Ltd",
        );
        await expect(page.getByRole("textbox", { name: /Email/ })).toHaveValue(
            "ops@northwind.test",
        );
        await expect(page.getByRole("textbox", { name: /Address/ })).toHaveValue(
            "Level 12, Emaar Square, Dubai",
        );

        expect(api.unmatched).toEqual([]);
    });

    test("settings refuse to submit without a company name", async ({ page }) => {
        await mockApi(page);
        await page.goto("/corporate/settings");

        const name = page.getByRole("textbox", { name: /Company Name/ });
        await expect(name).toHaveValue("Northwind Ltd");
        await name.fill("");
        await page.getByRole("button", { name: "Save Changes" }).click();

        await expect(page.getByText("Company name is required")).toBeVisible();
    });

    test("enrolment list swaps to records at 320px with Manage reachable", async ({ page }) => {
        await mockApi(page, { enrollments: adminEnrolmentsResponse() });
        await page.setViewportSize({ width: 320, height: 720 });
        await page.goto("/corporate/enrollments");

        await expect(page.getByRole("table")).toBeHidden();
        const record = page.getByRole("listitem").filter({ hasText: "Lee Learner" });
        await expect(record).toHaveCount(1);
        await expect(record.getByRole("button", { name: /Manage/ })).toBeVisible();

        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });
});
