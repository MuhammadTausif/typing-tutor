// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TypeSnake', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/velocity-typesnake.html');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/TypeSnake/);
  });

  test('shows HUD chips (score, combo, time)', async ({ page }) => {
    await expect(page.locator('#score')).toBeVisible();
    await expect(page.locator('#combo')).toBeVisible();
    await expect(page.locator('#time')).toBeVisible();
  });

  test('shows game canvas', async ({ page }) => {
    await expect(page.locator('canvas#game')).toBeVisible();
  });

  test('shows start overlay on load', async ({ page }) => {
    await expect(page.locator('.overlay')).toBeVisible();
  });

  test('shows virtual keyboard', async ({ page }) => {
    await expect(page.locator('.kbd')).toBeVisible();
  });

  test('has no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    expect(errors).toHaveLength(0);
  });
});
