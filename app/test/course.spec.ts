import { test, expect } from '@playwright/test';
import { CoursePage } from './coursePage';
import { login, student1 } from './testLogin';

test.beforeEach(async ({ page }) => {
  await login(page, student1)
});

test.describe('New Course', () => {
  test('should allow me to create course then go there', async ({ page }) => {
    await page.locator('header button').click()
    await page.locator('aside >> text=New Course').click();
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

test.describe('Open Questions', () => {
  test('should display open question and amount of answers and likes', async ({ page }) => {
    // given
    const coursePage = new CoursePage(page);

    // when
    await coursePage.goto("57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958")

    // then
    await expect(coursePage.openQuestions).toHaveText("Whats up?")
    await expect(coursePage.amountsOfAnswers).toHaveText("0 Answers")
    await expect(coursePage.amountsOfLikes).toHaveText("0 Likes")
  });

  test('should increase the amount of likes after clicking the like button', async ({ page }) => {
    // given
    const coursePage = new CoursePage(page);
    await coursePage.goto("57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958")
    await page.waitForTimeout(5_000)

    // when
    await coursePage.likeButton.click()

    // then
    await expect(coursePage.amountsOfLikes.first()).toHaveText("1 Like")
  });

  test('should decrease the amount of likes after clicking the unlike button', async ({ page }) => {
    // given
    const coursePage = new CoursePage(page);
    await coursePage.goto("57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958")
    await page.waitForTimeout(5_000)

    // when
    await coursePage.unlikeButton.click()

    // then
    await expect(coursePage.amountsOfLikes.first()).toHaveText("0 Likes")
  });
})
