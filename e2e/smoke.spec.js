import { test, expect } from '@playwright/test';

test.describe('Public site', () => {
  test('homepage loads with main navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByLabel('Main');
    await expect(nav.getByRole('link', { name: 'Shop' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('shop page loads product catalog', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.getByPlaceholder('Search products…')).toBeVisible();
    await expect(page.getByText('Loading products…')).toBeHidden({ timeout: 30_000 });
    await expect(page.getByRole('heading', { name: /\d+ products/ })).toBeVisible();
  });

  test('login page shows sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });
});
