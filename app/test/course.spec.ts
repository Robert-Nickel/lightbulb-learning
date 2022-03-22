import { test, expect } from '@playwright/test';
import { loginStudent} from './testLogin';

test.beforeEach(async ({ page }) => {
  await loginStudent(page)
});

test.describe('New Course', () => {
  test('should allow me to create course then go there', async ({ page }) => {
    await page.locator('header button').click()
    await page.locator('aside >> text=Create').click();
    await page.locator('input').type("new course")
    await page.locator('button:has-text("Create")').click()
    await expect(page.locator('h1')).toHaveText('new course');
  });
})

test.describe('Delete Course', () => {
  test('should allow me to delete course', async ({ page }) => {
    page.on('dialog', async dialog => {
      dialog.accept().catch(() => { });
    });
    await page.goto('http://localhost:3000/course');
    await page.locator('text=course for deletion').click();
    await page.locator('text=Settings').click()
    await page.locator('text=Delete course for deletion').click()
    await page.waitForNavigation()
    await expect(page.locator('text=course for deletion')).not.toBeVisible()
  });
})