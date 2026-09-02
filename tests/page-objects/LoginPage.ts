import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  get emailInput(): Locator {
    return this.page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
  }

  get passwordInput(): Locator {
    return this.page.locator('input[type="password"], input[name="password"]');
  }

  get submitButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  get registerLink(): Locator {
    return this.page.locator('a[href*="/register"]');
  }

  async goto() {
    await this.navigateTo('/auth/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }

  async expectValidationMessage(text: string) {
    await expect(this.page.locator('body')).toContainText(text);
  }
}

