import { test, expect } from '@playwright/test';
import { login } from './test_login';

test.describe('Login', () => {
  test('should allow me to login and display challenge pools', async ({ page }) => {
    await login(page)
    await expect(page.locator('h1')).toHaveText('Challenge Pools');
  });
})
