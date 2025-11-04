# Playwright Testing Guide - Advanced Features

This guide covers the advanced Playwright testing features including authentication, visual regression testing, multi-viewport screenshots, dark mode variants, and CI/CD automation.

## Table of Contents

- [Authentication](#authentication)
- [Visual Regression Testing](#visual-regression-testing)
- [Multiple Viewports](#multiple-viewports)
- [Dark Mode Screenshots](#dark-mode-screenshots)
- [CI/CD Automation](#cicd-automation)
- [Available Scripts](#available-scripts)
- [Directory Structure](#directory-structure)

## Authentication

### Setup

Authentication is handled automatically via `tests/e2e/auth.setup.ts`. The setup file:

1. Checks for test credentials in environment variables
2. Logs in to the application
3. Saves the authentication state to `.auth/user.json`
4. Reuses this state across all tests

### Configuration

Set the following environment variables:

```bash
# .env.local or CI secrets
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-test-password
```

### Without Credentials

If credentials are not provided, tests will run without authentication. This is useful for:
- Testing public pages
- Local development
- Initial setup

## Visual Regression Testing

### Overview

Visual regression tests automatically compare screenshots against baseline images to detect unintended visual changes.

### Running Visual Regression Tests

```bash
# Run visual regression tests
npm run test:e2e:visual

# Update baseline snapshots (after intentional UI changes)
npm run test:e2e:update-snapshots
```

### How It Works

1. **First run**: Creates baseline snapshots in `tests/e2e/workspace-screenshots.spec.ts-snapshots/`
2. **Subsequent runs**: Compares current screenshots with baselines
3. **On failure**: Generates diff images showing pixel differences
4. **Tolerance**: Allows up to 100 pixels difference and 20% threshold to account for anti-aliasing

### Baseline Management

- **Commit baselines**: Check baseline screenshots into git
- **Update baselines**: Run with `--update-snapshots` after intentional UI changes
- **Review diffs**: Check `-diff.png` files when tests fail

## Multiple Viewports

### Supported Configurations

Screenshots are captured in 6 different configurations:

1. **Desktop Light** - Desktop Chrome, light color scheme
2. **Desktop Dark** - Desktop Chrome, dark color scheme  
3. **Tablet Light** - iPad Pro, light color scheme
4. **Tablet Dark** - iPad Pro, dark color scheme
5. **Mobile Light** - iPhone 14 Pro, light color scheme
6. **Mobile Dark** - iPhone 14 Pro, dark color scheme

### Screenshot Organization

Screenshots are organized by project (viewport + color scheme):

```
screenshots/
├── desktop-light/
│   ├── workspace-members.png
│   ├── workspace-sso-settings.png
│   └── ...
├── desktop-dark/
│   ├── workspace-members.png
│   └── ...
├── tablet-light/
├── tablet-dark/
├── mobile-light/
└── mobile-dark/
```

### Running Specific Viewports

```bash
# Run tests for specific project only
npx playwright test --project=desktop-light
npx playwright test --project=mobile-dark
npx playwright test --project=tablet-light

# Run all desktop variants
npx playwright test --grep=desktop
```

## Dark Mode Screenshots

### Automatic Dark Mode Detection

Each test configuration includes a `colorScheme` setting that:
- Automatically sets the browser's preferred color scheme
- Triggers CSS media query `@media (prefers-color-scheme: dark)`
- Captures the dark variant without code changes

### Verifying Dark Mode

Your application should use CSS media queries or JavaScript to detect color scheme:

```css
/* CSS */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #ffffff;
  }
}
```

```javascript
// JavaScript
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

## CI/CD Automation

### GitHub Actions Workflow

A GitHub Actions workflow (`.github/workflows/playwright-screenshots.yml`) automatically:

1. **On Push/PR**: Runs all tests including visual regression
2. **Scheduled**: Runs daily at 2 AM UTC to catch regressions early
3. **Manual**: Can be triggered via workflow_dispatch

### Workflow Jobs

#### 1. Test Job
- Runs on push, PR, and schedule
- Executes all Playwright tests
- Uploads screenshots and reports as artifacts
- Uploads visual regression diffs on failure

#### 2. Screenshots Job
- Runs on manual trigger and schedule
- Generates screenshots only (faster)
- Uploads screenshots with 90-day retention
- Comments on PRs with screenshot list

### Setting Up CI Secrets

Add these secrets to your GitHub repository:

1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets:
   - `TEST_USER_EMAIL`: Test account email
   - `TEST_USER_PASSWORD`: Test account password

### Viewing Results

- **Artifacts**: Download from the workflow run page
- **Reports**: View HTML report in artifacts
- **PR Comments**: Screenshots job comments on PRs with screenshot list

## Available Scripts

```bash
# Run all E2E tests (all viewports and modes)
npm run test:e2e

# Run screenshot tests only
npm run test:e2e:screenshots

# Run visual regression tests
npm run test:e2e:visual

# Open Playwright UI for interactive debugging
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step-by-step
npm run test:e2e:debug

# Update visual regression baselines
npm run test:e2e:update-snapshots

# Install Playwright browsers
npm run playwright:install

# View latest test report
npm run playwright:report
```

## Directory Structure

```
Q-Persona/
├── .auth/                          # Authentication state (gitignored)
│   └── user.json                   # Saved login session
├── .github/
│   └── workflows/
│       └── playwright-screenshots.yml  # CI/CD workflow
├── screenshots/                    # Generated screenshots (gitignored)
│   ├── desktop-light/
│   ├── desktop-dark/
│   ├── tablet-light/
│   ├── tablet-dark/
│   ├── mobile-light/
│   └── mobile-dark/
├── tests/
│   └── e2e/
│       ├── auth.setup.ts          # Authentication setup
│       ├── workspace-screenshots.spec.ts  # Screenshot tests
│       ├── visual-regression.spec.ts      # Visual regression tests
│       ├── workspace-screenshots.spec.ts-snapshots/  # Baseline images
│       └── README.md              # This file
├── playwright.config.ts           # Playwright configuration
└── package.json                   # Scripts and dependencies
```

## Best Practices

### 1. Authentication
- Use dedicated test accounts
- Store credentials in environment variables
- Never commit credentials to git

### 2. Visual Regression
- Review diffs carefully before updating baselines
- Update baselines only for intentional changes
- Keep baselines in version control

### 3. Screenshots
- Run on stable environments
- Wait for animations to complete
- Use consistent data for reproducible results

### 4. CI/CD
- Set appropriate retention days for artifacts
- Monitor scheduled runs for regressions
- Keep test environment similar to production

## Troubleshooting

### Tests Fail Without Authentication
- Check `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` are set
- Verify the test account exists and is active
- Check login form selectors match your application

### Visual Regression Tests Always Fail
- Increase `maxDiffPixels` or `threshold` in tests
- Check for dynamic content (timestamps, random data)
- Ensure fonts are loaded consistently

### Screenshots Look Different Locally vs CI
- Install browsers with `--with-deps` flag
- Use consistent viewport sizes
- Check for timezone or locale differences

### Dark Mode Not Working
- Verify CSS media queries are implemented
- Check JavaScript color scheme detection
- Test manually with browser DevTools

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Visual Comparisons Guide](https://playwright.dev/docs/test-snapshots)
- [Authentication Guide](https://playwright.dev/docs/auth)
- [CI/CD Best Practices](https://playwright.dev/docs/ci)
