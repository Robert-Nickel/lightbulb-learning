import { test, expect } from '@playwright/test';
import { loginStudent } from './testLogin';

test.describe('Login', () => {
  test('should allow me to login and display challenge pools', async ({ page }) => {
    await loginStudent(page)
    await expect(page.locator('h1')).toHaveText('Challenge Pools');
  });
})
