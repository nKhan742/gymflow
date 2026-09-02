import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common Header & Navigation Locators
  get sidebar(): Locator {
    return this.page.locator('aside');
  }

  get userMenuButton(): Locator {
    return this.page.locator('header button[aria-haspopup="menu"]');
  }

  get themeToggleButton(): Locator {
    return this.page.locator('button[title*="theme"], button:has(.lucide-moon), button:has(.lucide-sun)');
  }

  get toastSuccess(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="success"]');
  }

  get toastError(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="error"]');
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async expectPageTitle(title: string) {
    await expect(this.page.locator('h1, h2').filter({ hasText: title }).first()).toBeVisible();
  }

  async clickSidebarItem(label: string) {
    await this.page.locator('aside a, aside button').filter({ hasText: label }).first().click();
  }
}

