# E2E Tests and Screenshots

This directory contains End-to-End (E2E) tests for Q-Persona, built with Playwright.

## Purpose

The primary purpose of these tests is to:
1. Take full-page screenshots of all workspace pages for documentation
2. Verify that pages load correctly
3. Support visual regression testing in the future

## Screenshot Storage

Screenshots are saved to `./screenshots/` directory in the project root, **not** to `/tmp/playwright-logs/` which is temporary and gets cleared on system restart.

This ensures:
- Screenshots persist across sessions
- Screenshots can be version-controlled if needed (currently gitignored)
- Easy access for documentation and review

## Running Tests

### Prerequisites

First, install Playwright browsers:

```bash
npm run playwright:install
```

### Running All E2E Tests

```bash
npm run test:e2e
```

### Running Only Screenshot Tests

To capture workspace screenshots:

```bash
npm run test:e2e:screenshots
```

### Interactive Mode

For debugging and development:

```bash
npm run test:e2e:ui
```

## Test Structure

### Workspace Screenshots (`workspace-screenshots.spec.ts`)

Captures full-page screenshots of all workspace-related pages:
- Workspace Members page
- SSO Settings page
- API Keys page
- Audit Logs page
- Webhooks page

Each test:
1. Navigates to the page
2. Waits for the network to be idle
3. Takes a full-page screenshot
4. Saves to `screenshots/workspace-{page-name}.png`

## Configuration

Playwright configuration is in `playwright.config.ts` at the project root.

Key settings:
- **Base URL**: `http://localhost:3000` (configurable via `BASE_URL` env var)
- **Screenshot Directory**: `./screenshots/`
- **Browser**: Chromium (Desktop Chrome device)
- **Timeout**: 30 seconds per test
- **Dev Server**: Automatically starts Next.js dev server before tests

## Notes

- Tests currently do not authenticate. You may need to modify tests to handle authentication for protected pages.
- Screenshots are gitignored by default. If you want to commit screenshots for documentation, remove the relevant line from `.gitignore`.
- The dev server must be running or will be started automatically when running tests.

## Future Enhancements

- [ ] Add authentication handling for protected routes
- [ ] Add visual regression testing with screenshot comparison
- [ ] Capture screenshots in different viewport sizes
- [ ] Add dark mode screenshot variants
- [ ] Automate screenshot generation in CI/CD pipeline
