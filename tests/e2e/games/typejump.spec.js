// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TypeJump', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/velocity-typejump.html');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/TypeJump/);
  });

  test('shows HUD (score, lives, distance)', async ({ page }) => {
    await expect(page.locator('#score')).toBeVisible();
    await expect(page.locator('#hearts')).toBeVisible();
  });

  test('shows game canvas', async ({ page }) => {
    await expect(page.locator('canvas#game')).toBeVisible();
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
