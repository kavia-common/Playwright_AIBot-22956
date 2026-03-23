import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for VizAI E2E tests.
 *
 * NOTE: This project expects the frontend to be running already.
 * Configure the target URL via the FRONTEND_URL environment variable.
 *
 * This suite is intended to run against the VizAI deployed Admin SPA, which is
 * served under the `/admin/` base path in some environments.
 */
function normalizeBaseUrl(raw?: string): string {
  /**
   * Normalize baseURL so helper navigation (e.g. page.goto('/')) keeps working.
   *
   * Requirements:
   * - Always end with `/admin/` (and a trailing slash) so relative navigation
   *   resolves into the deployed Admin SPA.
   * - If FRONTEND_URL is not set, default to the deployed Amplify `/admin/` URL.
   */
  const fallback = 'https://dev-vizai-digitalt3.d1nvg85x14z35u.amplifyapp.com/admin/';
  const input = (raw ?? '').trim();
  if (!input) return fallback;

  // Ensure we have a trailing slash so Playwright's URL resolution behaves
  // predictably (page.goto('/') resolves against baseURL).
  const withSlash = input.endsWith('/') ? input : `${input}/`;

  // If the user provides the site root, default to the admin base path.
  // Examples:
  //  - https://example.com        -> https://example.com/admin/
  //  - https://example.com/       -> https://example.com/admin/
  //  - https://example.com/admin  -> https://example.com/admin/
  //  - https://example.com/admin/ -> https://example.com/admin/
  if (!/\/admin\/$/i.test(withSlash)) {
    // Normalize to exactly one trailing slash before appending "admin/".
    const normalizedRoot = withSlash.replace(/\/+$/, '/');
    return `${normalizedRoot}admin/`;
  }

  return withSlash;
}

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : [['html', { open: 'never' }]],

  use: {
    // Prefer configured env var; default to local dev admin path.
    // Set FRONTEND_URL to the deployed admin URL, e.g.
    // https://dev-vizai-digitalt3.d1nvg85x14z35u.amplifyapp.com/admin/
    baseURL: normalizeBaseUrl(process.env.FRONTEND_URL),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
