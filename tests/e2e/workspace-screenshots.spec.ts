import { test, expect, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * E2E tests for workspace pages
 * Takes full-page screenshots of all workspace pages for documentation
 * Screenshots are saved to ./screenshots/ directory instead of /tmp/playwright-logs/
 * Supports multiple viewports and dark mode variants
 */

test.describe('Workspace Screenshots', () => {
  // Use authenticated state if available
  test.use({ 
    storageState: path.join(__dirname, '../../.auth/user.json'),
  });

  // Helper function to get screenshot path based on project and page name
  const getScreenshotPath = (pageName: string, projectName: string): string => {
    const screenshotDir = path.join(process.cwd(), 'screenshots', projectName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    return path.join(screenshotDir, `${pageName}.png`);
  };

  // Helper function to take screenshot and verify page
  const capturePageScreenshot = async (page: Page, url: string, pageName: string, projectName: string) => {
    await page.goto(url);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Additional wait for any animations or dynamic content
    await page.waitForTimeout(1000);
    
    // Take full-page screenshot
    const screenshotPath = getScreenshotPath(pageName, projectName);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
    
    // Verify the page loaded correctly
    await expect(page).toHaveTitle(/Q-Persona/);
    
    return screenshotPath;
  };

  test('capture workspace members page', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await capturePageScreenshot(page, '/dashboard/workspace/members', 'workspace-members', projectName);
  });

  test('capture workspace SSO settings page', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await capturePageScreenshot(page, '/dashboard/workspace/settings/sso', 'workspace-sso-settings', projectName);
  });

  test('capture workspace API keys page', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await capturePageScreenshot(page, '/dashboard/workspace/settings/api-keys', 'workspace-api-keys', projectName);
  });

  test('capture workspace audit logs page', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await capturePageScreenshot(page, '/dashboard/workspace/settings/audit', 'workspace-audit-logs', projectName);
  });

  test('capture workspace webhooks page', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await capturePageScreenshot(page, '/dashboard/workspace/settings/webhooks', 'workspace-webhooks', projectName);
  });
});
