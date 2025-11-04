import { test, expect } from '@playwright/test';
import * as path from 'path';

/**
 * Visual Regression Tests
 * Compares screenshots against baseline images to detect visual changes
 * Baseline images are stored in tests/e2e/snapshots/
 */

test.describe('Visual Regression Tests', () => {
  // Use authenticated state if available
  test.use({ 
    storageState: path.join(__dirname, '../../.auth/user.json'),
  });

  // Helper function to prepare page and take snapshot
  const comparePageSnapshot = async (page: any, url: string, snapshotName: string) => {
    await page.goto(url);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Additional wait for any animations or dynamic content
    await page.waitForTimeout(1000);
    
    // Compare against baseline snapshot
    // Playwright will automatically create baseline on first run
    await expect(page).toHaveScreenshot(`${snapshotName}.png`, {
      fullPage: true,
      // Allow for minor differences due to anti-aliasing, fonts, etc.
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  };

  test('workspace members page - visual regression', async ({ page }) => {
    await comparePageSnapshot(page, '/dashboard/workspace/members', 'workspace-members');
  });

  test('workspace SSO settings page - visual regression', async ({ page }) => {
    await comparePageSnapshot(page, '/dashboard/workspace/settings/sso', 'workspace-sso-settings');
  });

  test('workspace API keys page - visual regression', async ({ page }) => {
    await comparePageSnapshot(page, '/dashboard/workspace/settings/api-keys', 'workspace-api-keys');
  });

  test('workspace audit logs page - visual regression', async ({ page }) => {
    await comparePageSnapshot(page, '/dashboard/workspace/settings/audit', 'workspace-audit-logs');
  });

  test('workspace webhooks page - visual regression', async ({ page }) => {
    await comparePageSnapshot(page, '/dashboard/workspace/settings/webhooks', 'workspace-webhooks');
  });
});
