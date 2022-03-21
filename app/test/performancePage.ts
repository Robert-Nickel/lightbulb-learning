import { expect, Locator, Page } from '@playwright/test';

export const EL_STUDENTO = '4e5e689a-a09c-4e20-858c-14d442251457';

export class PerformancePage {
  readonly page: Page;
  readonly title: Locator;
  readonly latestEvaluation: Locator;
  readonly changeButton: Locator;
  readonly saveButton: Locator;
  readonly evaluationInput: Locator;
  readonly openQuestionPerformance: OpenQuestionPerformance;
  /*
  readonly getStartedLink: Locator;
  readonly gettingStartedHeader: Locator;
  readonly pomLink: Locator;
  readonly tocList: Locator;
  */

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.latestEvaluation = page.locator('id=latest-evaluation');
    this.changeButton = page.locator('text=Change');
    this.saveButton = page.locator('text=Save');
    this.evaluationInput = page.locator('id=evaluation-input');
    this.openQuestionPerformance = new OpenQuestionPerformance(this.page);
    /*
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.pomLink = page.locator('li', { hasText: 'Playwright Test' }).locator('a', { hasText: 'Page Object Model' });
    this.tocList = page.locator('article ul > li > a');
    */
  }

  async goto(challengePoolUserId: string) {
    await this.page.goto('/performance/' + challengePoolUserId);
  }

  async hasPerformanceEntry(text: string) {
    await this.page.locator('h4', { hasText: text })
  }

  /*
  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }
 
  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }*/
}

export class OpenQuestionPerformance {
  readonly metadata: Locator;
  readonly questionText: Locator;
  readonly answerText: Locator;

  constructor(page: Page) {
    this.metadata = page.locator('text=/.*- Open Question -.*/gm');
    this.questionText = page.locator('id=oqp-question-text');
    this.answerText = page.locator('id=oqp-answer-text');
  }
}