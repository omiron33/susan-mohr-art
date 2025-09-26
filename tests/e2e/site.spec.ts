import { test, expect } from "@playwright/test";

test.describe("Site navigation", () => {
  test("homepage renders hero copy", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Susan Mohr Art|beauty/i);
    await expect(page.getByRole("link", { name: /shop prints/i })).toBeVisible();
  });

  test("galleries page lists categories", async ({ page }) => {
    await page.goto("/galleries");
    const cards = page.getByRole("heading", { level: 2 });
    await expect(cards.first()).toBeVisible();
  });

  test("prints page shows products", async ({ page }) => {
    await page.goto("/prints");
    await expect(page.getByRole("heading", { name: /fine art prints/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /buy print/i })).toBeVisible();
  });

  test("contact form validates input", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/please share your name/i)).toBeVisible();
    await expect(page.getByText(/enter a valid email/i)).toBeVisible();
  });
});
