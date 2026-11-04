import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 60_000,
  expect: { timeout: 30_000 },
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.SMOKE_BASE_URL || 'https://events.chironapp.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    proxy: process.env.SMOKE_PROXY ? { server: process.env.SMOKE_PROXY, bypass: 'localhost,127.0.0.1' } : undefined,
    launchOptions: process.env.SMOKE_CHROMIUM_PATH
      ? { executablePath: process.env.SMOKE_CHROMIUM_PATH }
      : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
