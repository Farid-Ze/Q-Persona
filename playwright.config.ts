import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Q-Persona
 * Takes full-page screenshots of workspace pages for documentation and testing
 * Supports multiple viewports, dark mode, and visual regression testing
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Maximum time one test can run for
  timeout: 60 * 1000,
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot settings
    screenshot: 'only-on-failure',
    
    // Video settings for debugging
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },

  // Configure projects for different viewports and color schemes
  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    // Desktop - Light Mode
    {
      name: 'desktop-light',
      use: { 
        ...devices['Desktop Chrome'],
        colorScheme: 'light',
      },
      dependencies: ['setup'],
    },
    
    // Desktop - Dark Mode
    {
      name: 'desktop-dark',
      use: { 
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
      dependencies: ['setup'],
    },
    
    // Tablet - Light Mode
    {
      name: 'tablet-light',
      use: { 
        ...devices['iPad Pro'],
        colorScheme: 'light',
      },
      dependencies: ['setup'],
    },
    
    // Tablet - Dark Mode
    {
      name: 'tablet-dark',
      use: { 
        ...devices['iPad Pro'],
        colorScheme: 'dark',
      },
      dependencies: ['setup'],
    },
    
    // Mobile - Light Mode
    {
      name: 'mobile-light',
      use: { 
        ...devices['iPhone 14 Pro'],
        colorScheme: 'light',
      },
      dependencies: ['setup'],
    },
    
    // Mobile - Dark Mode
    {
      name: 'mobile-dark',
      use: { 
        ...devices['iPhone 14 Pro'],
        colorScheme: 'dark',
      },
      dependencies: ['setup'],
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
