import { Locator, Page } from '@playwright/test';

export class CoursePage {
  readonly page: Page;
  readonly title: Locator;
  readonly questions: Locator;
  readonly amountsOfAnswers: Locator;
  readonly amountsOfLikes: Locator;
  readonly likeButton: Locator;
  readonly unlikeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.questions = page.locator('id=question-text')
    this.amountsOfAnswers = page.locator('id=amount-of-answers-small')
    this.amountsOfLikes = page.locator('id=amount-of-likes-small')
    this.likeButton = page.locator('text=Like!')
    this.unlikeButton = page.locator('text=Unlike')
  }

  async goto(courseId: string) {
    await this.page.goto('/course/' + courseId);
    await this.page.waitForTimeout(3_000)
  }
}