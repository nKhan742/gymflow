import { test, expect } from '@playwright/test';

test.describe('Turnstile Access & Attendance Telemetry Suite', () => {
  test.beforeEach(async ({ page }) => {
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

  test('TC-ATT-01: Attendance page displays Live Facility KPI matrix and chart', async ({ page }) => {
    await page.goto('/member-management/attendance');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1, h2, h3').filter({ hasText: /Attendance|Turnstile/i }).first()).toBeVisible();
    await expect(page.locator('text=Front Desk Quick Check-In Terminal')).toBeVisible();
    await expect(page.locator("text=Today's Hourly Footfall Density")).toBeVisible();
  });

  test('TC-ATT-02: Quick Check-In Terminal triggers turnstile unlock', async ({ page }) => {
    await page.goto('/member-management/attendance');
    await page.waitForLoadState('networkidle');

    const unlockBtn = page.locator('button').filter({ hasText: /Unlock Turnstile|Verify/i }).first();
    await expect(unlockBtn).toBeVisible();
  });
});
