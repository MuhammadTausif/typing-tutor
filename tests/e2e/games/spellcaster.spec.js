// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Spell Caster', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/velocity-spellcaster.html');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/SpellCaster|Spell/i);
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
