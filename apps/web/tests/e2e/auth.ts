import {
	type APIRequestContext,
	type BrowserContext,
	test as base,
} from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";

/**
 * E2E fixtures — signs in once per worker, stores session, reuses across tests.
 *
 * Required env vars:
 *   TEST_CLERK_EMAIL    - test user email
 *   TEST_CLERK_PASSWORD - test user password
 */
type Fixtures = {
	authedCtx: BrowserContext;
	authedRequest: APIRequestContext;
};

const test = base.extend<Fixtures>({
	authedCtx: async ({ browser }, use) => {
		const email = process.env.TEST_CLERK_EMAIL || "test@example.com";
		const password = process.env.TEST_CLERK_PASSWORD || "password123";

		// Step 1: authenticate via UI
		const ctx = await browser.newContext();
		const page = await ctx.newPage();

		await page.goto(`${BASE_URL}/sign-in`);
		await page.waitForLoadState("networkidle");

		if (!page.url().includes("/sign-in")) {
			console.log("[auth] Already signed in at:", page.url());
		} else {
			const emailInput = page
				.locator('input[name="emailAddress"], input[type="email"]')
				.first();
			const passInput = page
				.locator('input[name="password"], input[type="password"]')
				.first();

			if (!(await emailInput.isVisible())) {
				throw new Error(
					"Sign-in form not found. Set TEST_CLERK_EMAIL and TEST_CLERK_PASSWORD.",
				);
			}

			await emailInput.fill(email);
			await passInput.fill(password);
			await page.locator('button[type="submit"]').first().click();
			await page.waitForURL("**/dashboard**", { timeout: 20_000 });
			console.log("[auth] Signed in as:", email);
		}

		// Persist session to disk so tests can reuse it
		const storagePath = "./tests/e2e/.auth/user.json";
		await ctx.storageState({ path: storagePath });
		await ctx.close();

		// Step 2: create a new context from saved state — tests get this
		const authedCtx = await browser.newContext({ storageState: storagePath });
		await use(authedCtx);
		await authedCtx.close();
	},

	authedRequest: async ({ authedCtx }, use) => {
		// Create an API request context bound to the authenticated browser context
		// This inherits cookies/session from the authed browser context
		const request = await authedCtx.request;
		await use(request);
	},
});

export { BASE_URL, test };
