// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Professional Tutor Shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index1.html');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Velocity/i);
  });

  test('shows sidebar navigation', async ({ page }) => {
    await expect(page.locator('.sidebar')).toBeVisible();
  });

  test('shows all nav items', async ({ page }) => {
    const navItems = page.locator('.nav-item');
    await expect(navItems).toHaveCount(6);
  });

  test('dashboard view is active by default', async ({ page }) => {
    await expect(page.locator('[data-view="dashboard"]')).toHaveClass(/active/);
  });

  test('clicking lessons nav shows lessons view', async ({ page }) => {
    await page.click('[data-view="lessons"]');
    await expect(page.locator('#lessons-view')).toHaveClass(/active/);
  });

  test('clicking achievements nav shows gamification view', async ({ page }) => {
    await page.click('[data-view="gamification"]');
    await expect(page.locator('#gamification-view')).toHaveClass(/active/);
  });

  test('has no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    expect(errors).toHaveLength(0);
  });
});
