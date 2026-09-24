import type { BrowserContext, Page } from "@playwright/test";

export type TestRole = "LEARNER" | "PLATFORM_ADMIN" | "INSTRUCTOR" | "CORPORATE_ADMIN";

export const LEARNER_ID = "user-learner-1";
export const ADMIN_ID = "user-admin-1";
export const INSTRUCTOR_ID = "inst-1";
export const CORPORATE_ID = "user-corp-1";
export const COMPANY_ID = "co-1";

function base64url(input: string): string {
    return Buffer.from(input, "utf-8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * The app's middleware only base64-decodes the JWT payload to read `role`; it
 * never verifies a signature. This mints the minimum token shape routing needs
 * so tests can reach authenticated screens without a backend. Test-only.
 */
export function testToken(role: TestRole, userId: string): string {
    const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = base64url(
        JSON.stringify({
            sub: userId,
            role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        }),
    );
    return `${header}.${payload}.test-signature-not-verified`;
}

function testUser(role: TestRole) {
    switch (role) {
        case "PLATFORM_ADMIN":
            return {
                id: ADMIN_ID,
                email: "admin@example.test",
                role,
                firstName: "Ada",
                lastName: "Admin",
                emailVerified: true,
            };
        case "INSTRUCTOR":
            return {
                id: INSTRUCTOR_ID,
                email: "riya@example.test",
                role,
                firstName: "Riya",
                lastName: "Kapoor",
                emailVerified: true,
            };
        case "CORPORATE_ADMIN":
            return {
                id: CORPORATE_ID,
                email: "ops@northwind.test",
                role,
                firstName: "Cora",
                lastName: "Porter",
                emailVerified: true,
                companyId: COMPANY_ID,
            };
        default:
            return {
                id: LEARNER_ID,
                email: "learner@example.test",
                role,
                firstName: "Lee",
                lastName: "Learner",
                emailVerified: true,
            };
    }
}

export interface SignInOptions {
    context: BrowserContext;
    page: Page;
    /** Playwright's baseURL fixture; cookies are scoped to it. */
    baseURL: string;
    role: TestRole;
}

/**
 * Seeds the cookie the middleware reads and the zustand-persisted store the
 * client reads, so the app boots straight into an authenticated session.
 */
export async function signIn({ context, page, baseURL, role }: SignInOptions) {
    const user = testUser(role);
    const token = testToken(role, user.id);

    await context.addCookies([{ name: "auth-token", value: token, url: baseURL }]);

    await page.addInitScript(
        ({ user, token }) => {
            window.localStorage.setItem(
                "auth-storage",
                JSON.stringify({ state: { user, token, isHydrated: false }, version: 0 }),
            );
            window.localStorage.setItem("auth-token", token);
        },
        { user, token },
    );

    return { user, token };
}
