import { Locator, Page } from '@playwright/test';

export const EL_STUDENTO = '4e5e689a-a09c-4e20-858c-14d442251457';

export class PerformancePage {
  readonly page: Page;
  readonly title: Locator;
  readonly latestProgress: Locator;
  readonly changeButton: Locator;
  readonly saveButton: Locator;
  readonly progressInput: Locator;
  readonly openQuestionPerformance: OpenQuestionPerformance;
  readonly progress: Progress;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.latestProgress = page.locator('id=latest-progress');
    this.changeButton = page.locator('text=Change');
    this.saveButton = page.locator('text=Save');
    this.progressInput = page.locator('id=progress-input');
    this.openQuestionPerformance = new OpenQuestionPerformance(this.page);
    this.progress = new Progress(this.page);
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

export class Progress {
  readonly metadata: Locator;
  readonly progressText: Locator;

  constructor(page: Page) {
    this.metadata = page.locator('text=/.*- Open Question -.*/gm');
    this.progressText = page.locator('id=progress-text');
  }
}