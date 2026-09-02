import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  get gymNameInput(): Locator {
    return this.page.locator('input[placeholder*="Gym" i], input[placeholder*="Apex" i], input[placeholder*="facility" i]').first();
  }

  get fullNameInput(): Locator {
    return this.page.locator('input[placeholder*="name" i], input[placeholder*="John" i]').first();
  }

  get emailInput(): Locator {
    return this.page.locator('input[type="email"], input[placeholder*="email" i]').first();
  }

  get passwordInput(): Locator {
    return this.page.locator('input[type="password"]').first();
  }

  get nextButton(): Locator {
    return this.page.locator('button:has-text("Next"), button:has-text("Continue"), button[type="submit"]');
  }

  async goto() {
    await this.navigateTo('/auth/register');
  }
}

