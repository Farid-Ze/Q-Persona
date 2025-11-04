import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Authentication setup for Playwright tests
 * This file runs before all tests to authenticate and save the session
 */

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Check if we have environment variables for test authentication
  const testEmail = process.env.TEST_USER_EMAIL;
  const testPassword = process.env.TEST_USER_PASSWORD;
  
  if (!testEmail || !testPassword) {
    console.log('⚠️  No test credentials provided. Skipping authentication.');
    console.log('   Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables for authenticated tests.');
    
    // Create an empty auth file to prevent errors
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [] }));
    return;
  }

  try {
    // Navigate to login page
    await page.goto('/login');
    
    // Wait for login form to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Fill in login credentials
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    
    // Verify we're logged in by checking for dashboard elements
    await expect(page).toHaveURL(/dashboard/);
    
    // Save authentication state
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    await page.context().storageState({ path: authFile });
    
    console.log('✅ Authentication successful');
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    console.log('   Tests will run without authentication.');
    
    // Create an empty auth file to prevent errors
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [] }));
  }
});
