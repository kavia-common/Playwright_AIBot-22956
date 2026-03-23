import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for VizAI E2E tests.
 *
 * NOTE: This project expects the frontend to be running already.
 * Configure the target URL via the FRONTEND_URL environment variable.
 */
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
    // Prefer configured env var; fall back to local dev default.
    baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
