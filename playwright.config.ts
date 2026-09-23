import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3210);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
    testDir: "./e2e",
    // The dev server compiles routes on first hit, so give navigation room.
    timeout: 90_000,
    expect: { timeout: 15_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
    use: {
        baseURL,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
        },
    ],
    webServer: process.env.E2E_BASE_URL
        ? undefined
        : {
              command: `pnpm exec next dev --port ${PORT}`,
              url: baseURL,
              // Always start our own server: other apps on this machine
              // squat nearby ports, and reusing one silently tests the
              // wrong app. Point E2E_BASE_URL at a server to opt out.
              reuseExistingServer: false,
              timeout: 240_000,
          },
});
