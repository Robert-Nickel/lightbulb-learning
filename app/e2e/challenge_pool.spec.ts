import { test, expect, Page } from '@playwright/test';
import { login } from './test_login';

test.beforeEach(async ({ page }) => {
  await login(page)
});

test.describe('New Challenge Pool', () => {
  test('should allow me to create challenge pool then go there', async ({ page }) => {
    await page.locator('header button').click()
    await page.pause()
    await page.locator('a:has-text("Create")').click();
    await page.locator('input').type("new challenge pool")
    await page.locator('button:has-text("Create")').click()
    await expect(page.locator('h1')).toHaveText('new challenge pool');
  });
})