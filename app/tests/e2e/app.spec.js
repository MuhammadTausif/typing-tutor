import { test, expect } from '@playwright/test'

test.describe('Velocity Typing Tutor', () => {
  test('dashboard loads with key elements', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Velocity/)
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Day streak')).toBeVisible()
    await expect(page.getByText('Continue')).toBeVisible()
  })

  test('lessons page shows levels', async ({ page }) => {
    await page.goto('/lessons')
    await expect(page.getByText('Home Row')).toBeVisible()
    await expect(page.getByText('Top Row')).toBeVisible()
    await expect(page.getByText('Left Hand Home')).toBeVisible()
  })

  test('practice page loads lesson 1', async ({ page }) => {
    await page.goto('/lessons/1')
    await expect(page.getByText('Left Hand Home')).toBeVisible()
    await expect(page.getByText('A · S · D · F')).toBeVisible()
    // typing area is present
    await expect(page.locator('[aria-label="Typing input"]')).toBeAttached()
  })

  test('typing a character advances the cursor', async ({ page }) => {
    await page.goto('/lessons/1')
    await page.locator('[aria-label="Typing input"]').focus()
    await page.keyboard.press('a')
    // first char should now be correct (green)
    const firstChar = page.locator('.font-mono.text-xl span').first()
    await expect(firstChar).toHaveClass(/text-slate-200/)
  })

  test('arcade page shows 6 game cards', async ({ page }) => {
    await page.goto('/arcade')
    await expect(page.getByText('TypeSnake')).toBeVisible()
    await expect(page.getByText('TypeJump')).toBeVisible()
    await expect(page.getByText('SpellCaster')).toBeVisible()
    const cards = page.locator('a[href*="/games/velocity-"]')
    await expect(cards).toHaveCount(6)
  })

  test('achievements page renders', async ({ page }) => {
    await page.goto('/achievements')
    await expect(page.getByText('Achievements')).toBeVisible()
    await expect(page.getByText('First Steps')).toBeVisible()
  })

  test('settings toggles work', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByText('Sound effects')).toBeVisible()
    // toggle sound off
    const toggle = page.getByRole('switch', { name: /sound/i })
    const initialState = await toggle.getAttribute('aria-checked')
    await toggle.click()
    const newState = await toggle.getAttribute('aria-checked')
    expect(newState).not.toBe(initialState)
  })

  test('404 page shows for unknown route', async ({ page }) => {
    await page.goto('/does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText('Page not found')).toBeVisible()
  })
})
