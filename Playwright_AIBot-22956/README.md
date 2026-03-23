# Playwright AI Bot – VizAI E2E

This container contains Playwright tests for the VizAI frontend, including basic AI Chatbot checks.

## Prerequisites

- Frontend must be running and reachable.
- Optionally set `FRONTEND_URL` to override the target deployed URL.

By default (when `FRONTEND_URL` is not set), the tests run against the deployed VizAI Admin SPA:

- `https://dev-vizai-digitalt3.d1nvg85x14z35u.amplifyapp.com/admin/`

## Run

```bash
npm install
npm test
```

To override:

```bash
FRONTEND_URL="http://localhost:5173/admin/" npm test
```

## Notes on authentication

Some VizAI routes are protected. The tests are written to:
- accept a redirect to `/login` as a valid "app loaded" state
- **skip** chat interaction tests when a login page is detected

If you want full coverage, add an authenticated `storageState` setup and update the tests to use it.
