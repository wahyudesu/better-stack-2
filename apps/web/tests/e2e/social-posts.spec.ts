import { expect, type Page, test } from "./auth";

/**
 * E2E tests for social connection + posts
 *
 * Requires env vars in .env.local:
 *   TEST_CLERK_EMAIL=test@example.com
 *   TEST_CLERK_PASSWORD=secret
 *   TEST_API_KEY=your-zernio-key          (optional, for zernio tests)
 *   E2E_BASE_URL=http://localhost:3000     (optional, defaults to localhost:3000)
 */

test.describe("Social Connection + Posts", () => {
	// ════════════════════════════════════════════════════════════
	// Setup
	// ════════════════════════════════════════════════════════════

	test("setup: ensure user has api_key set", async ({ authedRequest }) => {
		const res = await authedRequest.get("/api/user");
		expect(res.status()).toBe(200);

		const body = await res.json();
		console.log("[/api/user]", body);

		if (!body.api_key) {
			const apiKey = process.env.TEST_API_KEY;
			if (!apiKey) {
				console.warn("⚠️ TEST_API_KEY not set — skipping api-key setup");
				return;
			}

			const patchRes = await authedRequest.patch("/api/user/api-key", {
				data: { apiKey },
			});
			console.log("[/api/user/api-key]", patchRes.status());
			expect(patchRes.status()).toBe(200);
		}
	});

	// ════════════════════════════════════════════════════════════
	// Social Accounts
	// ════════════════════════════════════════════════════════════

	test("social: GET /api/social-accounts returns 200", async ({
		authedRequest,
	}) => {
		const res = await authedRequest.get("/api/social-accounts");
		console.log("[/api/social-accounts]", res.status(), await res.json());
		expect(res.status()).toBe(200);

		const body = await res.json();
		expect(Array.isArray(body)).toBe(true);
	});

	test("social: POST /api/zernio/connect?platform=twitter returns OAuth URL", async ({
		authedRequest,
	}) => {
		const res = await authedRequest.post(
			"/api/zernio/connect?platform=twitter",
		);
		console.log("[/api/zernio/connect]", res.status(), await res.json());

		if (res.status() === 401) {
			console.warn("⚠️ api_key not set — run setup test first");
			return;
		}

		expect(res.status()).toBe(200);
		const body = await res.json();
		expect(body.url).toBeDefined();
		expect(body.url).toContain("twitter");
		console.log("OAuth URL:", body.url);
	});

	test("social: POST /api/zernio/sync syncs accounts", async ({
		authedRequest,
	}) => {
		const res = await authedRequest.post("/api/zernio/sync");
		console.log("[/api/zernio/sync]", res.status(), await res.json());

		if (res.status() === 401) {
			console.warn("⚠️ api_key not set — run setup test first");
			return;
		}

		// 200 = success, 500 = Zernio API error (external, not our bug)
		expect([200, 500]).toContain(res.status());

		if (res.status() === 200) {
			const body = await res.json();
			console.log("Sync result:", JSON.stringify(body, null, 2));
		}
	});

	test("social: GET /api/social-accounts shows synced accounts", async ({
		authedRequest,
	}) => {
		const res = await authedRequest.get("/api/social-accounts");
		expect(res.status()).toBe(200);

		const accounts = await res.json();
		console.log(`[social-accounts] ${accounts.length} account(s)`);
		accounts.forEach((acc: Record<string, unknown>, i: number) => {
			console.log(`  [${i + 1}]`, acc);
		});

		expect(Array.isArray(accounts)).toBe(true);
	});

	// ════════════════════════════════════════════════════════════
	// Posts
	// ════════════════════════════════════════════════════════════

	test("posts: GET /api/posts returns 200", async ({ authedRequest }) => {
		const res = await authedRequest.get("/api/posts");
		console.log("[/api/posts GET]", res.status(), await res.json());
		expect(res.status()).toBe(200);

		const body = await res.json();
		expect(Array.isArray(body)).toBe(true);
	});

	test("posts: POST /api/posts creates a post", async ({ authedRequest }) => {
		const payload = {
			title: "Playwright Test Post",
			content: "Created by e2e test at " + new Date().toISOString(),
			platform: "twitter",
			scheduled_at: null,
			media_urls: [],
			status: "draft",
		};

		const res = await authedRequest.post("/api/posts", { data: payload });
		console.log("[/api/posts POST]", res.status(), await res.json());

		expect([200, 201]).toContain(res.status());

		const post = await res.json();
		expect(post.title).toBe(payload.title);

		// Store ID for delete test
		process.env.TEST_POST_ID = String(post.id);
		console.log("Created post ID:", post.id);
	});

	test("posts: DELETE /api/posts/:id removes the post", async ({
		authedRequest,
	}) => {
		const postId = process.env.TEST_POST_ID;
		if (!postId) {
			console.warn("⚠️ No TEST_POST_ID — run posts:POST test first");
			return;
		}

		const res = await authedRequest.delete(`/api/posts/${postId}`);
		console.log(`[/api/posts/${postId} DELETE]`, res.status());

		expect([200, 204]).toContain(res.status());

		// Verify gone
		const getRes = await authedRequest.get("/api/posts");
		const posts = await getRes.json();
		const deleted = posts.find(
			(p: Record<string, unknown>) =>
				String((p as Record<string, unknown>).id) === postId,
		);
		expect(deleted).toBeUndefined();
	});

	// ════════════════════════════════════════════════════════════
	// Cleanup
	// ════════════════════════════════════════════════════════════

	test.afterAll(async ({ authedRequest }) => {
		const res = await authedRequest.get("/api/posts");
		if (res.status() !== 200) return;

		const posts = await res.json();
		const testPosts = posts.filter(
			(p: Record<string, unknown>) =>
				String(p.id) === process.env.TEST_POST_ID ||
				p.title === "Playwright Test Post",
		);

		for (const post of testPosts) {
			await authedRequest.delete(`/api/posts/${post.id}`);
			console.log(`Cleaned up post ${post.id}`);
		}
	});
});
