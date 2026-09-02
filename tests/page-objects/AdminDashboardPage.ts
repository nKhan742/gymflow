import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  get metricCards(): Locator {
    return this.page.locator('[data-testid="metric-card"], .grid > div:has(h3), .grid > div:has(.text-2xl)');
  }

  get branchSelector(): Locator {
    return this.page.locator('header select, header button:has-text("Branch"), header button:has(.lucide-building-2)');
  }

  async goto() {
    await this.navigateTo('/dashboard/admin-dashboard');
  }

  async expectKpisRendered() {
    await expect(this.page.locator('body')).not.toContainText('NaN');
    await expect(this.page.locator('body')).not.toContainText('undefined');
  }
}

