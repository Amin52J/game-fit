import { test, expect } from "./fixtures";

test.describe("Navigation", () => {
  test("sidebar shows all nav items", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");

    const sidebar = page.getByLabel("Main navigation");
    await expect(sidebar).toBeVisible();

    for (const label of ["Analyze", "Library", "History", "Settings", "Help"]) {
      await expect(sidebar.getByText(label)).toBeVisible();
    }
  });

  test("shows user info in sidebar footer", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await expect(page.getByText("e2e@GameOrWait.test")).toBeVisible();
  });

  test("navigate to Library page", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Library").click();
    await expect(page.getByText("Game Library")).toBeVisible();
  });

  test("navigate to History page", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("History").click();
    await expect(page.getByText("Analysis history")).toBeVisible();
  });

  test("navigate to Settings page", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Settings").click();
    await expect(page.getByText("Settings").first()).toBeVisible();
  });

  test("navigate to Help page", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Help").click();
    await expect(page.getByText("Help & Guide")).toBeVisible();
  });

  test("can navigate back to Analyze from another page", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("Help").click();
    await expect(page.getByText("Help & Guide")).toBeVisible();

    await page.getByLabel("Main navigation").getByText("Analyze").click();
    await expect(page.locator("#analyze-game-name")).toBeVisible();
  });

  test("logout flow shows confirmation modal", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByRole("button", { name: "Log Out" }).click();

    await expect(page.getByText("Log out?")).toBeVisible();
    await expect(page.getByText("Are you sure you want to log out of GameOrWait?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("logout modal can be dismissed with Cancel", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByRole("button", { name: "Log Out" }).click();
    await expect(page.getByText("Log out?")).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Log out?")).not.toBeVisible();
  });
});
