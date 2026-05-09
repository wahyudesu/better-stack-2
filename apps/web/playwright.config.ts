import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	testMatch: "**/*.spec.ts",
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: 1,
	reporter: "list",
	use: {
		baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
	},
});
