import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";
import {
    ADMIN_CATEGORIES,
    ADMIN_COUPONS,
    MODERATION_COURSES,
    coursesResponse,
} from "./support/fixtures";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "PLATFORM_ADMIN" });
});

test.describe("training operations — catalogue admin", () => {
    test("categories list keeps counts, order and active state", async ({ page }) => {
        const api = await mockApi(page);
        await page.goto("/admin/categories");

        await expect(page.getByRole("heading", { name: "Categories", level: 1 })).toBeVisible();
        const table = page.getByRole("table");
        await expect(table.getByRole("row")).toHaveCount(ADMIN_CATEGORIES.length + 1);

        const active = table.getByRole("row", { name: /Data & Analytics/ });
        await expect(active).toContainText("data-analytics");
        await expect(active).toContainText("12");
        await expect(active).toContainText("Active");
        await expect(table.getByRole("row", { name: /Retired Topics/ })).toContainText("Inactive");

        expect(api.unmatched).toEqual([]);
    });

    test("category row menu exposes edit, toggle and delete", async ({ page }) => {
        await mockApi(page);
        await page.goto("/admin/categories");

        await page.getByRole("button", { name: "Actions for Data & Analytics" }).click();
        const menu = page.getByRole("menu");
        await expect(menu.getByRole("menuitem", { name: "Edit" })).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: "Deactivate" })).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: "Delete" })).toBeVisible();
    });

    test("coupons show discount shape, usage and expiry", async ({ page }) => {
        await mockApi(page);
        await page.goto("/admin/coupons");

        await expect(
            page.getByRole("heading", { name: "Coupon management", level: 1 }),
        ).toBeVisible();
        const table = page.getByRole("table");
        await expect(table.getByRole("row")).toHaveCount(ADMIN_COUPONS.length + 1);

        const percentage = table.getByRole("row", { name: /LAUNCH25/ });
        await expect(percentage).toContainText("25%");
        await expect(percentage).toContainText("(max $100)");
        await expect(percentage).toContainText("42");
        await expect(percentage).toContainText("500");
        await expect(percentage).toContainText("Data & Analytics");
        await expect(percentage).toContainText("Active");

        // Past its validTill, so it reads as expired regardless of isActive.
        const expired = table.getByRole("row", { name: /OLDSALE/ });
        await expect(expired).toContainText("$50");
        await expect(expired).toContainText("Expired");
        await expect(expired).toContainText("All courses");
    });

    test("moderation lists only courses awaiting review", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse(MODERATION_COURSES as never) });
        await page.goto("/admin/moderation");

        await expect(
            page.getByRole("heading", { name: "Content moderation", level: 1 }),
        ).toBeVisible();

        const table = page.getByRole("table");
        // Two drafts in the payload, one pending review.
        await expect(table.getByRole("row")).toHaveCount(2);
        await expect(table.getByRole("row", { name: /Forecasting in Practice/ })).toBeVisible();
        await expect(page.getByText("1 course awaiting review")).toBeVisible();
    });

    test("moderation approve asks before publishing", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse(MODERATION_COURSES as never) });
        await page.goto("/admin/moderation");

        await page.getByRole("button", { name: /Approve/ }).click();
        const dialog = page.getByRole("alertdialog");
        await expect(dialog).toContainText("Approve Course?");
        await expect(dialog.getByRole("button", { name: /Approve & Publish/ })).toBeVisible();
    });

    test("moderation reject requires a reason", async ({ page }) => {
        await mockApi(page, { courses: coursesResponse(MODERATION_COURSES as never) });
        await page.goto("/admin/moderation");

        await page.getByRole("button", { name: /Reject/ }).click();
        const dialog = page.getByRole("dialog");
        const submit = dialog.getByRole("button", { name: "Reject Course" });
        await expect(submit).toBeDisabled();

        await dialog.getByRole("textbox", { name: "Reason for rejection" }).fill("Audio is poor");
        await expect(submit).toBeEnabled();
    });
});
