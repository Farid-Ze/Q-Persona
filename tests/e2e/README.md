# E2E Tests and Screenshots

This directory contains End-to-End (E2E) tests for Q-Persona, built with Playwright.

## 🚀 Quick Start

```bash
# Install Playwright browsers
npm run playwright:install

# Run all tests
npm run test:e2e

# Generate screenshots only
npm run test:e2e:screenshots

# Run visual regression tests
npm run test:e2e:visual
```

## ✨ Features

### 1. **Authentication Handling** ✅
Automatically handles login for protected routes using environment variables.

### 2. **Visual Regression Testing** ✅
Compares screenshots against baselines to detect unintended visual changes.

### 3. **Multiple Viewports** ✅
Captures screenshots in 6 different configurations:
- Desktop (Light & Dark)
- Tablet (Light & Dark)
- Mobile (Light & Dark)

### 4. **Dark Mode Variants** ✅
Automatically captures both light and dark theme screenshots.

### 5. **CI/CD Automation** ✅
GitHub Actions workflow for automated testing and screenshot generation.

## 📁 Screenshot Storage

Screenshots are saved to `./screenshots/{viewport-colorScheme}/` directory:

```
screenshots/
├── desktop-light/
├── desktop-dark/
├── tablet-light/
├── tablet-dark/
├── mobile-light/
└── mobile-dark/
```

**Not** saved to `/tmp/playwright-logs/` which is temporary and gets cleared.

## 📖 Documentation

- **[ADVANCED_TESTING.md](./ADVANCED_TESTING.md)** - Comprehensive guide covering all features
- **Quick Reference** - This file

## 🔐 Authentication Setup

Set environment variables for authenticated tests:

```bash
# .env.local
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-password
```

Tests gracefully degrade to unauthenticated mode if credentials are not provided.

## 📸 Screenshot Tests

### Running Tests

```bash
# All viewports and color schemes
npm run test:e2e:screenshots

# Specific viewport
npx playwright test --project=desktop-light
npx playwright test --project=mobile-dark
```

### Captured Pages

- Workspace Members
- SSO Settings
- API Keys
- Audit Logs  
- Webhooks

## 🔍 Visual Regression Tests

### Running Tests

```bash
# Compare against baselines
npm run test:e2e:visual

# Update baselines (after UI changes)
npm run test:e2e:update-snapshots
```

### How It Works

1. First run creates baseline snapshots
2. Subsequent runs compare against baselines
3. Generates diff images on failure
4. Allows tolerance for anti-aliasing

## 🤖 CI/CD Automation

### GitHub Actions Workflow

Located at `.github/workflows/playwright-screenshots.yml`

**Triggers:**
- Push to main/develop
- Pull requests
- Daily at 2 AM UTC
- Manual dispatch

**Outputs:**
- Screenshot artifacts (30-90 day retention)
- HTML test reports
- Visual regression diffs
- PR comments with screenshot lists

### Setup

Add repository secrets:
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

## 📝 Test Files

- **`auth.setup.ts`** - Authentication setup
- **`workspace-screenshots.spec.ts`** - Screenshot generation
- **`visual-regression.spec.ts`** - Visual comparison tests

## 🔧 Configuration

See `playwright.config.ts` for:
- Viewport configurations
- Timeout settings
- Reporter options
- Color scheme settings

## 🆘 Need Help?

See [ADVANCED_TESTING.md](./ADVANCED_TESTING.md) for:
- Detailed setup instructions
- Troubleshooting guide
- Best practices
- Architecture details
