import { test, expect } from '@playwright/test';
import { EL_STUDENTO, PerformancePage } from './performancePage';
import { loginStudent } from './testLogin';

test.beforeEach(async ({ page }) => {
  await loginStudent(page)
});

test.describe('Performances', () => {
  test('should display open question performance', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    await performancePage.goto(EL_STUDENTO)
    await expect(performancePage.openQuestionPerformance.metadata).toContainText("- Open Question - 0 likes") // ignore date and time
    await expect(performancePage.openQuestionPerformance.questionText).toHaveText("Whats up?")
    await expect(performancePage.openQuestionPerformance.answerText).toHaveText("- Not much, bro.")
  });
})

test.describe('Evaluations', () => {
  test('should display correct defaults', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    await performancePage.goto(EL_STUDENTO)
    await expect(performancePage.title).toHaveText('Performance of El Studento');
    await expect(performancePage.latestEvaluation).toHaveText('0%');
    await expect(performancePage.changeButton).toBeVisible();
  });

  test('should show new evaluation after creation', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    await performancePage.goto(EL_STUDENTO)
    await page.waitForTimeout(1_000)
    await performancePage.changeButton.click()
    await performancePage.evaluationInput.fill("33")
    await performancePage.saveButton.click()
    await expect(performancePage.latestEvaluation).toHaveText("33%")
    // should also be displayed after page refresh
    await performancePage.goto(EL_STUDENTO)
    await page.waitForTimeout(1_000)
    await expect(performancePage.latestEvaluation).toHaveText("33%")
  })
})