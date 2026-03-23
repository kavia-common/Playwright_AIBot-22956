import { expect, type Page } from '@playwright/test';

/**
 * Attempts to reach the chat UI.
 *
 * The VizAI app uses protected routes; the Chat experience is available via the
 * FloatingChat widget that should appear on most authenticated pages.
 *
 * In environments where authentication is enforced, these tests may need an
 * auth setup project (storageState) or a test-only auth bypass.
 */

// PUBLIC_INTERFACE
export async function gotoAppRoot(page: Page): Promise<void> {
  /**
   * Navigate to the SPA root for the configured Playwright `baseURL`.
   *
   * Important: In deployed environments, VizAI may be hosted under `/admin/`.
   * The Playwright config sets `baseURL` accordingly, so `page.goto('/')` will
   * resolve to `${baseURL}/` (i.e., the admin app root).
   */
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {
    // Some apps keep polling; don't fail hard on networkidle.
  });
}

// PUBLIC_INTERFACE
export async function openFloatingChatIfPresent(page: Page): Promise<void> {
  /**
   * Open a floating chat widget if one exists.
   * We use a heuristic: look for a visible "AI" affordance or a chat button.
   */
  const possibleButtons = [
    page.getByRole('button', { name: /chat/i }),
    page.getByRole('button', { name: /assistant/i }),
    page.getByRole('button', { name: /^ai$/i }),
  ];

  for (const btn of possibleButtons) {
    if (await btn.first().isVisible().catch(() => false)) {
      await btn.first().click();
      return;
    }
  }
}

// PUBLIC_INTERFACE
export async function expectChatHeaderVisible(page: Page): Promise<void> {
  /** Verify the chat UI header is visible. */
  await expect(page.getByRole('heading', { name: /vizai assistant/i })).toBeVisible();
}

// PUBLIC_INTERFACE
export async function sendChatMessage(page: Page, message: string): Promise<void> {
  /** Send a message in the chat input using stable locators. */
  const input = page.getByPlaceholder(/ask a question about behavior data\.\.\./i);
  await expect(input).toBeVisible();
  await input.fill(message);

  const sendBtn = page.getByRole('button', { name: /send message/i });
  await expect(sendBtn).toBeEnabled();
  await sendBtn.click();
}
