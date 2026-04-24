import { test, expect } from "@playwright/test";

test.describe("Waitlist Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays waitlist form on homepage", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Join Waitlist" })).toBeVisible();
  });

  test("shows validation error for empty email", async ({ page }) => {
    await page.click("button:has-text('Join Waitlist')");
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("shows validation error for invalid email format", async ({ page }) => {
    const input = page.getByPlaceholder("Enter your email");
    await input.fill("invalid-email");
    await page.click("button:has-text('Join Waitlist')");
    await expect(page.getByText("Email is required")).toBeVisible();
  });
});