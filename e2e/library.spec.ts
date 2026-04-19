import { test, expect } from "./fixtures";

test.describe("Game Library", () => {
  test("renders library page with title", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Library").click();

    await expect(page.getByText("Game Library")).toBeVisible();
  });

  test("shows add game button", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Library").click();

    await expect(page.getByRole("button", { name: /Add Game/ })).toBeVisible();
  });

  test("opens add game modal", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Library").click();

    await page.getByRole("button", { name: /Add Game/ }).click();
    await expect(page.getByRole("heading", { name: "Add Game" })).toBeVisible();
  });

  test("toggles import section", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Library").click();

    await page.getByText("Import Games").click();
    await expect(page.getByText(/import a CSV/)).toBeVisible();
  });

  test("displays games from state", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Library").click();

    await expect(page.getByText("Elden Ring")).toBeVisible();
    await expect(page.getByText("Hollow Knight")).toBeVisible();
    await expect(page.getByText("Hades")).toBeVisible();
  });

  test("shows learn more and scoring links", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Library").click();

    await expect(page.getByRole("link", { name: "Learn more" })).toBeVisible();
    await expect(page.getByRole("link", { name: "How scoring works" })).toBeVisible();
  });
});
