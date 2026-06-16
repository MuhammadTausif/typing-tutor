// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Type Garden', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/velocity-typegarden.html');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/TypeGarden|Garden/i);
  });

  test('shows HUD chips', async ({ page }) => {
    await expect(page.locator('#score')).toBeVisible();
  });

  test('shows start overlay on load', async ({ page }) => {
    await expect(page.locator('.overlay')).toBeVisible();
  });

  test('has no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    expect(errors).toHaveLength(0);
  });
});
