import { test, expect } from '@playwright/test';
import { EL_STUDENTO, PerformancePage } from './performancePage';
import { login, student1 } from './testLogin';

test.beforeEach(async ({ page }) => {
  await login(page, student1)
});

test.describe('Performances', () => {
  test('should display open question performance', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    await performancePage.goto(EL_STUDENTO)
    await expect(performancePage.openQuestionPerformance.metadata).toHaveText("- Open Question - 0 likes") // ignore date and time
    await expect(performancePage.openQuestionPerformance.questionText).toHaveText("Whats up?")
  });
})

test.describe('Progresses', () => {
  test('should display correct defaults', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    await performancePage.goto(EL_STUDENTO)
    await expect(performancePage.title).toHaveText('Performance of El Studento');
    await expect(performancePage.latestProgress).toHaveText('0%');
    await expect(performancePage.changeButton).toBeVisible();
  });

  test('should show new progress after creating it', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    await performancePage.goto(EL_STUDENTO)
    await page.waitForTimeout(1_000)
    await performancePage.changeButton.click()
    await performancePage.progressInput.fill("33")
    await performancePage.saveButton.click()
    // display without page reload as latest progress
    await expect(performancePage.latestProgress).toHaveText("33%")
    // display without page reload in list
    await expect(performancePage.progress.progressText).toHaveText("Reached 33%")

    await performancePage.goto(EL_STUDENTO)
    await page.waitForTimeout(1_000)
    // display with page refresh as latest progress
    await expect(performancePage.latestProgress).toHaveText("33%")
    // display with page refresh in list
    await expect(performancePage.progress.progressText).toHaveText("Reached 33%")
  })
})