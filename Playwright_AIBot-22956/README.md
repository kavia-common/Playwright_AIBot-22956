# Playwright AI Bot – VizAI E2E

This container contains Playwright tests for the VizAI frontend, including basic AI Chatbot checks.

## Prerequisites

- Frontend must be running and reachable.
- Set `FRONTEND_URL` to the frontend base URL (defaults to `http://localhost:5173`).

## Run

```bash
npm install
FRONTEND_URL="http://localhost:5173" npm test
```

## Notes on authentication

Some VizAI routes are protected. The tests are written to:
- accept a redirect to `/login` as a valid "app loaded" state
- **skip** chat interaction tests when a login page is detected

If you want full coverage, add an authenticated `storageState` setup and update the tests to use it.
