import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import pages from './pages.json';

test('every public route has a known page', () => {
  const files = readdirSync(path.resolve(__dirname, '../../app'), { recursive: true }) as string[];
  const routes = files.filter((file) => file.endsWith('.tsx') && !path.basename(file).startsWith('_') && !path.basename(file).startsWith('+'))
    .map((file) => '/' + file.replaceAll(path.sep, '/').replace(/\.tsx$/, '').replace(/(^|\/)index$/, ''));
  expect(routes.filter((route) => !pages.some((page) => page.route === route))).toEqual([]);
  for (const page of pages) {
    const template = page.route.split('/');
    const actual = page.path.split('/');
    expect(actual).toHaveLength(template.length);
    template.forEach((part, index) => {
      if (part.startsWith('[')) expect(actual[index]).not.toBe('');
      else expect(actual[index]).toBe(part);
    });
  }
});

for (const knownPage of pages) {
  test(`loads ${knownPage.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      // Chromium logs the document's 404 even when GitHub Pages correctly serves
      // the SPA fallback. Application console errors must still fail this check.
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
        errors.push(message.text());
      }
    });
    page.on('response', (response) => {
      if (response.url().includes('.supabase.co/rest/v1/') && response.status() >= 400) {
        errors.push(`Data request failed: ${response.status()} ${response.url()}`);
      }
    });
    // Analytics is outside the public page's functional contract.
    await page.route('**/www.googletagmanager.com/**', (route) => route.fulfill({ body: '' }));
    await page.route('**/google-analytics.com/**', (route) => route.fulfill({ body: '' }));

    const response = await page.goto(knownPage.path, { waitUntil: 'domcontentloaded' });
    expect([200, 404]).toContain(response?.status());
    await expect(page.getByText(knownPage.text, { exact: knownPage.text !== 'Bush Turkey' }).first()).toBeVisible();
    await expect(page.getByRole('progressbar')).toHaveCount(0);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('public-page-error')).toHaveCount(0);
    expect(errors, 'Runtime, hydration, console, or data errors').toEqual([]);
  });
}
