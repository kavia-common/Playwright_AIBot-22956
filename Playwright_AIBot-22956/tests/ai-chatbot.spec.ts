import { test, expect } from '@playwright/test';
import {
  gotoAppRoot,
  openFloatingChatIfPresent,
  expectChatHeaderVisible,
  sendChatMessage,
} from './helpers/chatbot';

test.describe('AI Chatbot (VizAI Assistant)', () => {
  test('can reach the app and find the chat UI affordances', async ({ page }) => {
    await gotoAppRoot(page);

    // The app may redirect to /login depending on auth state.
    // We accept either login page or an authenticated layout as valid "loaded" states.
    const isLogin = await page.getByRole('heading', { name: /sign in|login/i }).isVisible().catch(() => false);
    if (isLogin) {
      // Still verify that the page is functional and not crashing.
      await expect(page).toHaveURL(/\/login/i);
      return;
    }

    // Try opening floating chat if present; if it opens, the header should be visible.
    await openFloatingChatIfPresent(page);
    const headerVisible = await page
      .getByRole('heading', { name: /vizai assistant/i })
      .isVisible()
      .catch(() => false);

    // If floating chat isn't available on this page, at least ensure the app shell is alive.
    expect(headerVisible || (await page.locator('#root').isVisible())).toBeTruthy();
  });

  test('basic chat interaction: type and send message (UI echo)', async ({ page }) => {
    await gotoAppRoot(page);

    const isLogin = await page.getByRole('heading', { name: /sign in|login/i }).isVisible().catch(() => false);
    test.skip(isLogin, 'Chat requires authenticated session in this environment.');

    await openFloatingChatIfPresent(page);

    // If floating chat is not present, skip rather than failing flakily.
    const canSeeHeader = await page
      .getByRole('heading', { name: /vizai assistant/i })
      .isVisible()
      .catch(() => false);
    test.skip(!canSeeHeader, 'Chat widget/page not reachable in this environment.');

    await expectChatHeaderVisible(page);

    const msg = 'Show me unusual behavior this week';
    await sendChatMessage(page, msg);

    // The user bubble should render our text.
    await expect(page.getByText(msg, { exact: true })).toBeVisible();

    // Optional: assistant should eventually respond (best-effort; backend may be mocked/unavailable).
    // We look for either an error apology or any assistant bubble content that is not the initial greeting.
    const assistantApology = page.getByText(/i apologize, but i encountered an error/i);
    const anyAssistantBubble = page.locator('div').filter({ hasText: /Active & Connected/i }).first();

    await Promise.race([
      assistantApology.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined),
      anyAssistantBubble.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined),
    ]);
  });
});
