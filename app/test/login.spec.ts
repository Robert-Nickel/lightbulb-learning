import { test, expect } from '@playwright/test';
import { login, student1 } from './testLogin';

test.describe('Login', () => {
  test('should allow me to login and display courses', async ({ page }) => {
    await login(page, student1)
    await expect(page.locator('h1')).toHaveText('Courses');
  });
})
