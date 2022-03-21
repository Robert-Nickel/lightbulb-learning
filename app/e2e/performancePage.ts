import { expect, Locator, Page } from '@playwright/test';

export class PerformancePage {
    readonly page: Page;
    readonly title: Locator;
    readonly latestEvaluation: Locator;
    readonly changeButton: Locator;
    readonly saveButton: Locator;
    readonly evaluationInput: Locator;

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