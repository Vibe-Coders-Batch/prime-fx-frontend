import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import { ADMIN_COMPANIES, ADMIN_PAYMENTS, ADMIN_USERS, usersResponse } from "./support/fixtures";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
});

/** These three screens share the OpsList component, so they also cover it. */
test.describe("training operations — shared list shell", () => {
    test("users: table columns, fallbacks and verification state", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto("/admin/users");

        await expect(
            page.getByRole("heading", { name: "User management", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        for (const header of ["Name", "Email", "Role", "Status", "Created"]) {
            await expect(
                table.getByRole("columnheader", { name: header, exact: true }),
            ).toBeVisible();
        }
        await expect(table.getByRole("row")).toHaveCount(ADMIN_USERS.length + 1);

        const riya = table.getByRole("row", { name: /Riya Kapoor/ });
        await expect(riya).toContainText("Instructor");
        await expect(riya).toContainText("Verified");

        // No first or last name keeps the existing N/A placeholder.
        const nameless = table.getByRole("row", { name: /nameless@example.test/ });
        await expect(nameless).toContainText("N/A");
        await expect(nameless).toContainText("Unverified");

        expect(api.unmatched).toEqual([]);
    });

    test("users: Edit still opens the editor", async ({ page }) => {
        await mockApi(page);
        await page.goto("/admin/users");
        await page
            .getByRole("table")
            .getByRole("row", { name: /Riya Kapoor/ })
            .getByRole("button", { name: /Edit/ })
            .click();
        await expect(page.getByRole("dialog")).toBeVisible();
    });

    test("users: empty state keeps its explanation", async ({ page }) => {
        await mockApi(page, { users: usersResponse([]) });
        await page.goto("/admin/users");
        await expect(page.getByRole("heading", { name: "No users found" })).toBeVisible();
        await expect(page.getByText("Users will appear here once they register.")).toBeVisible();
    });

    test("users: records replace the table at 320px with the action intact", async ({ page }) => {
        await mockApi(page);
        await page.setViewportSize({ width: 320, height: 720 });
        await page.goto("/admin/users");

        await expect(page.getByRole("table")).toBeHidden();
        const record = page.getByRole("listitem").filter({ hasText: "Riya Kapoor" });
        await expect(record).toHaveCount(1);
        // Every table field survives the switch to records.
        await expect(record).toContainText("riya@example.test");
        await expect(record).toContainText("Instructor");
        await expect(record).toContainText("Created");
        await expect(record.getByRole("button", { name: /Edit/ })).toBeVisible();

        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });

    test("payments: amounts, gateways and status tones", async ({ page }) => {
        await mockApi(page);
        await page.goto("/admin/payments");

        await expect(
            page.getByRole("heading", { name: "Payment management", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        await expect(table.getByRole("row")).toHaveCount(ADMIN_PAYMENTS.length + 1);

        const ok = table.getByRole("row", { name: /pay_01HXYZ/ });
        await expect(ok).toContainText("AED 249.00");
        await expect(ok).toContainText("Success");
        await expect(table.getByRole("row", { name: /pay_01HABC/ })).toContainText("Pending");
        await expect(table.getByRole("row", { name: /pay_01HFAIL/ })).toContainText("Failed");
    });

    test("payments: search narrows by payment id", async ({ page }) => {
        await mockApi(page);
        await page.goto("/admin/payments");
        await expect(page.getByRole("table")).toBeVisible();

        await page.getByRole("textbox", { name: "Search payments by payment ID" }).fill("HFAIL");
        await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
    });

    test("companies: columns and destructive action preserved", async ({ page }) => {
        await mockApi(page);
        await page.goto("/admin/companies");

        await expect(
            page.getByRole("heading", { name: "Company management", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        await expect(table.getByRole("row")).toHaveCount(ADMIN_COMPANIES.length + 1);

        const northwind = table.getByRole("row", { name: /Northwind Ltd/ });
        await expect(northwind).toContainText("ops@northwind.test");
        await expect(northwind.getByRole("button", { name: /Edit/ })).toBeVisible();
        await expect(northwind.getByRole("button", { name: /Delete/ })).toBeVisible();

        // Missing contact details keep the existing placeholder.
        await expect(table.getByRole("row", { name: /Contoso FZ/ })).toContainText("N/A");
    });

    test("companies: delete asks for confirmation before firing", async ({ page }) => {
        await mockApi(page);
        await page.goto("/admin/companies");

        let asked = "";
        page.on("dialog", (dialog) => {
            asked = dialog.message();
            return dialog.dismiss();
        });

        await page
            .getByRole("table")
            .getByRole("row", { name: /Northwind Ltd/ })
            .getByRole("button", { name: /Delete/ })
            .click();

        await expect.poll(() => asked).toContain("Northwind Ltd");
        // Dismissed, so the row is still there.
        await expect(page.getByRole("table").getByRole("row", { name: /Northwind Ltd/ })).toBeVisible();
    });
});

test.describe("training operations — overview", () => {
    test("states platform totals as plain figures", async ({ context, page, baseURL }) => {
        await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
        const api = await mockApi(page);
        await page.goto("/admin/dashboard");

        await expect(
            page.getByRole("heading", { name: "Admin dashboard", level: 1 }),
        ).toBeVisible();

        const totals = page.getByRole("region", { name: /Platform totals/ });
        await expect(totals).toContainText("1,842");
        await expect(totals).toContainText("37");
        await expect(totals).toContainText("5,104");
        await expect(totals).toContainText("$412,350.50");

        expect(api.unmatched).toEqual([]);
    });

    test("ranks top courses in order of enrolments", async ({ context, page, baseURL }) => {
        await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
        await mockApi(page);
        await page.goto("/admin/dashboard");

        const top = page.getByRole("region", { name: /Top performing courses/ });
        const rows = top.getByRole("listitem");
        await expect(rows).toHaveCount(5);
        await expect(rows.nth(0)).toContainText("Applied SQL for Analysts");
        await expect(rows.nth(0)).toContainText("612 enrolments");
        await expect(rows.nth(4)).toContainText("Machine Learning Primer");
    });

    test("uses no gradient fills on the metric tiles", async ({ context, page, baseURL }) => {
        await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
        await mockApi(page);
        await page.goto("/admin/dashboard");
        await expect(page.getByRole("region", { name: /Platform totals/ })).toBeVisible();

        const gradientTiles = await page
            .getByRole("region", { name: /Platform totals/ })
            .locator('[class*="gradient"]')
            .count();
        expect(gradientTiles).toBe(0);
    });
});
