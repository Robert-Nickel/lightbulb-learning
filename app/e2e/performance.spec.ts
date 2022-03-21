import { test, expect } from '@playwright/test';
import { PerformancePage } from './performancePage';
import { loginStudent } from './testLogin';

test.beforeEach(async ({ page }) => {
    await loginStudent(page)

});

test.describe('Display performances', () => {
    test('should display me an open question performance', async ({ page }) => {
        const performancePage = new PerformancePage(page);
        await performancePage.goto('4e5e689a-a09c-4e20-858c-14d442251457')

        await expect(performancePage.title).toHaveText('Performance of El Studento');
    });
})

/*test.describe('Create Evaluation', () => {
  test('should allow me to create a new evaluation and display that', async ({ page }) => {
    await page.goto('http://localhost:3000/performance/41863ad2-e02a-4b33-9958-af6bcd04fb7b');
    
   
    await expect(page.locator('text=77%')).toBeVisible()
  });
})*/