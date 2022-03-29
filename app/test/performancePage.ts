import { Locator, Page } from '@playwright/test';

export const EL_STUDENTO = '4e5e689a-a09c-4e20-858c-14d442251457';

export class PerformancePage {
  readonly page: Page;
  readonly title: Locator;
  readonly latestEvaluation: Locator;
  readonly changeButton: Locator;
  readonly saveButton: Locator;
  readonly evaluationInput: Locator;
  readonly openQuestionPerformance: OpenQuestionPerformance;
  readonly evaluation: Evaluation;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.latestEvaluation = page.locator('id=latest-evaluation');
    this.changeButton = page.locator('text=Change');
    this.saveButton = page.locator('text=Save');
    this.evaluationInput = page.locator('id=evaluation-input');
    this.openQuestionPerformance = new OpenQuestionPerformance(this.page);
    this.evaluation = new Evaluation(this.page);
  }

  async goto(courseUserId: string) {
    await this.page.goto('/performance/' + courseUserId);
  }
}

export class OpenQuestionPerformance {
  readonly metadata: Locator;
  readonly questionText: Locator;

  constructor(page: Page) {
    this.metadata = page.locator('text=/.*- Open Question -.*/gm').first();
    this.questionText = page.locator('id=oqp-question-text').first();
  }
}

export class Evaluation {
  readonly metadata: Locator;
  readonly evaluationText: Locator;

  constructor(page: Page) {
    this.metadata = page.locator('text=/.*- Open Question -.*/gm');
    this.evaluationText = page.locator('id=evaluation-text');
  }
}