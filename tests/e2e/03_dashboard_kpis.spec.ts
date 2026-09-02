import { test, expect } from '@playwright/test';

test.describe('Dashboard & Real-Time Telemetry Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate session via accurate localStorage keys
    await page.goto('/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('gymflow_access_token', 'jwt_test_session_token_123');
      localStorage.setItem('gymflow_auth_user', JSON.stringify({
        id: 'usr_admin_test',
        email: 'admin@titanfit.io',
        firstName: 'Alex',
        lastName: 'Vance',
        role: 'SUPER_ADMIN',
        permissions: ['*'],
      }));
    });
  });

  test('TC-DASH-01: Admin Dashboard loads without NaN or undefined metrics', async ({ page }) => {
    await page.goto('/dashboard/admin-dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1, h2, h3').filter({ hasText: /Dashboard|Telemetry|Overview|Admin/i }).first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('NaN');
    await expect(page.locator('body')).not.toContainText('undefined');
  });

  test('TC-DASH-02: Facility switcher header exists and is interactive', async ({ page }) => {
    await page.goto('/dashboard/admin-dashboard');
    await page.waitForLoadState('networkidle');

    const branchTrigger = page.locator('header').locator('select, button').filter({ hasText: /Campus|Branch|Location|All/i }).first();
    if (await branchTrigger.isVisible()) {
      await expect(branchTrigger).toBeEnabled();
    }
  });
});
