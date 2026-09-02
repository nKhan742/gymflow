import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AttendancePage extends BasePage {
  get quickCheckInButton(): Locator {
    return this.page.locator('button:has-text("Unlock Turnstile"), button:has-text("Verify")');
  }

  get memberSelect(): Locator {
    return this.page.locator('select, input[placeholder*="Member Code"]');
  }

  get footfallChart(): Locator {
    return this.page.locator('.recharts-responsive-container');
  }

  async goto() {
    await this.navigateTo('/member-management/attendance');
  }
}

