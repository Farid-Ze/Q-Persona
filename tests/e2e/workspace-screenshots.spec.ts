import { test, expect } from '@playwright/test';
import * as path from 'path';

/**
 * E2E tests for workspace pages
 * Takes full-page screenshots of all workspace pages for documentation
 * Screenshots are saved to ./screenshots/ directory instead of /tmp/playwright-logs/
 */

test.describe('Workspace Screenshots', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'screenshots');

  test.beforeEach(async ({ page }) => {
    // TODO: Setup authentication if needed
    // For now, we'll just navigate to pages that might be publicly accessible
  });

  test('capture workspace members page', async ({ page }) => {
    await page.goto('/dashboard/workspace/members');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take full-page screenshot
    await page.screenshot({
      path: path.join(screenshotDir, 'workspace-members.png'),
      fullPage: true,
    });
    
    // Verify the page loaded correctly
    await expect(page).toHaveTitle(/Q-Persona/);
  });

  test('capture workspace SSO settings page', async ({ page }) => {
    await page.goto('/dashboard/workspace/settings/sso');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: path.join(screenshotDir, 'workspace-sso-settings.png'),
      fullPage: true,
    });
    
    await expect(page).toHaveTitle(/Q-Persona/);
  });

  test('capture workspace API keys page', async ({ page }) => {
    await page.goto('/dashboard/workspace/settings/api-keys');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: path.join(screenshotDir, 'workspace-api-keys.png'),
      fullPage: true,
    });
    
    await expect(page).toHaveTitle(/Q-Persona/);
  });

  test('capture workspace audit logs page', async ({ page }) => {
    await page.goto('/dashboard/workspace/settings/audit');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: path.join(screenshotDir, 'workspace-audit-logs.png'),
      fullPage: true,
    });
    
    await expect(page).toHaveTitle(/Q-Persona/);
  });

  test('capture workspace webhooks page', async ({ page }) => {
    await page.goto('/dashboard/workspace/settings/webhooks');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: path.join(screenshotDir, 'workspace-webhooks.png'),
      fullPage: true,
    });
    
    await expect(page).toHaveTitle(/Q-Persona/);
  });
});
