import { test, expect, FAKE_USER, SUPABASE_GLOB, AUTH_STORAGE_KEY } from "./fixtures";

test.describe("History Page", () => {
  test("shows analysis history with existing entries", async ({ authenticatedPage: page }) => {
    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("History").click();

    await expect(page.getByText("Analysis history")).toBeVisible();
    await expect(page.getByText("Balatro")).toBeVisible();
  });

  test("shows empty state when no history", async ({ page }) => {
    const FAKE_SESSION = {
      access_token: "e2e-fake-access-token",
      refresh_token: "e2e-fake-refresh-token",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: FAKE_USER,
    };

    const EMPTY_SETTINGS = {
      id: FAKE_USER.id,
      ai_provider: { type: "anthropic", apiKey: "sk-test", model: "claude-sonnet-4-6" },
      instructions: "",
      is_setup_complete: true,
      setup_answers: null,
    };

    await page.route(`${SUPABASE_GLOB}/auth/v1/token**`, (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(FAKE_SESSION),
      }),
    );
    await page.route(`${SUPABASE_GLOB}/auth/v1/user`, (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(FAKE_USER) }),
    );
    await page.route(`${SUPABASE_GLOB}/auth/v1/logout`, (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
    );
    await page.route(`${SUPABASE_GLOB}/rest/v1/user_settings**`, (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(EMPTY_SETTINGS),
      }),
    );
    await page.route(`${SUPABASE_GLOB}/rest/v1/games**`, (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.route(`${SUPABASE_GLOB}/rest/v1/analysis_history**`, (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.route(`${SUPABASE_GLOB}/functions/v1/**`, (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
    );

    await page.addInitScript(
      ({ key, session }) => {
        localStorage.setItem(key, JSON.stringify(session));
      },
      { key: AUTH_STORAGE_KEY, session: FAKE_SESSION },
    );

    await page.goto("/analyze");
    await page.getByLabel("Main navigation").getByText("History").click();

    await expect(page.getByText("No analyses yet")).toBeVisible();
  });
});
