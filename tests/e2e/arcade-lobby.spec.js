// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Arcade Lobby', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Velocity Arcade/);
  });

  test('shows all 6 game cabinets', async ({ page }) => {
    await expect(page.locator('.cabinet')).toHaveCount(6);
  });

  test('shows correct game names', async ({ page }) => {
    const names = await page.locator('.cabinet .info h3').allTextContents();
    expect(names).toEqual([
      'TypeSnake',
      'TypeJump',
      'TypeBlaster',
      'Spell Caster',
      'TypeBeat',
      'Type Garden',
    ]);
  });

  test('all game cards link to correct files', async ({ page }) => {
    const hrefs = await page.locator('.cabinet').evaluateAll(
      els => els.map(e => e.getAttribute('href'))
    );
    expect(hrefs).toEqual([
      'velocity-typesnake.html',
      'velocity-typejump.html',
      'velocity-typeblaster.html',
      'velocity-spellcaster.html',
      'velocity-typebeat.html',
      'velocity-typegarden.html',
    ]);
  });

  test('skill filter dims non-matching cabinets', async ({ page }) => {
    await page.click('[data-skill="keys"]');
    await expect(page.locator('.cabinet.match')).toHaveCount(1);
    await expect(page.locator('.cabinet.dim')).toHaveCount(5);
  });

  test('skill filter highlights words games', async ({ page }) => {
    await page.click('[data-skill="words"]');
    // TypeJump, TypeBlaster, Type Garden match "words"
    await expect(page.locator('.cabinet.match')).toHaveCount(3);
  });

  test('selecting Everything removes all dim/match states', async ({ page }) => {
    await page.click('[data-skill="keys"]');
    await page.click('[data-skill="all"]');
    await expect(page.locator('.cabinet.dim')).toHaveCount(0);
    await expect(page.locator('.cabinet.match')).toHaveCount(0);
  });

  test('filter chip becomes active on click', async ({ page }) => {
    const chip = page.locator('[data-skill="spelling"]');
    await chip.click();
    await expect(chip).toHaveClass(/on/);
  });

  test('Surprise me navigates away from the lobby', async ({ page }) => {
    await page.click('#surprise');
    await page.waitForURL(/velocity-type/);
    await expect(page).not.toHaveURL('/');
  });

  test('learning path shows 6 steps', async ({ page }) => {
    await expect(page.locator('.step')).toHaveCount(6);
  });

  test('has no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    expect(errors).toHaveLength(0);
  });
});
