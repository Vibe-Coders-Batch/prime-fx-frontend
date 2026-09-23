import { expect, test } from "@playwright/test";
import { mockApi } from "./support/api";
import { signIn } from "./support/session";

test.beforeEach(async ({ context, page, baseURL }) => {
    await signIn({ context, page, baseURL: baseURL!, role: "LEARNER" });
});

test.describe("learner dashboard decoration", () => {
    test("renders without the animated gradient wash", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/dashboard");
        await expect(page.getByRole("main")).toBeVisible();

        // The design direction rules out gradient washes and decorative blobs.
        const gradients = await page
            .locator('[style*="radial-gradient"], [style*="linear-gradient"]')
            .count();
        expect(gradients).toBe(0);
    });

    test("settles instead of animating forever", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/dashboard");
        await expect(page.getByRole("main")).toBeVisible();

        // The removed decoration was framer-motion driven, so it shows up as
        // inline transforms that never stop changing rather than as CSS
        // animations. Entrance transitions settle; loops do not.
        const snapshot = () =>
            page.evaluate(() =>
                Array.from(document.querySelectorAll<HTMLElement>("[style*='transform']"))
                    .map((el) => el.style.transform)
                    .join("|"),
            );

        await page.waitForTimeout(2500);
        const first = await snapshot();
        await page.waitForTimeout(1500);
        expect(await snapshot()).toBe(first);
    });

    test("orders the new-course row by when courses were actually added", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/dashboard");

        const row = page.getByRole("region", { name: "Recently added" });
        await expect(row).toBeVisible();

        // Fixture createdAt: Forecasting 2026-06-22, Applied SQL 2026-01-05,
        // Legacy Reporting 2025-11-02. Newest must lead.
        const text = await row.innerText();
        const forecasting = text.indexOf("Forecasting in Practice");
        const sql = text.indexOf("Applied SQL for Analysts");
        const legacy = text.indexOf("Legacy Reporting Tools");
        expect(forecasting).toBeGreaterThanOrEqual(0);
        expect(forecasting).toBeLessThan(sql);
        expect(sql).toBeLessThan(legacy);
    });

    test("drops the labels the data could not support", async ({ page }) => {
        await mockApi(page);
        await page.goto("/learner/dashboard");
        await expect(page.getByRole("main")).toBeVisible();

        // Nothing in the model marks a course as featured, and the old
        // "New Releases" row was an unsorted slice of the same list.
        const body = await page.locator("body").innerText();
        expect(body).not.toContain("Featured Courses");
        expect(body).not.toContain("New Releases");
    });
});
