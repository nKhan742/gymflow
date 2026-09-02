import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { SECURITY_PAYLOADS } from '../utils/securityPayloads';

test.describe('Authentication & Zero-Trust Security Suite', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-AUTH-01: Page renders cleanly with security layout & inputs', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/auth\/login/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('TC-AUTH-02: Form rejects empty submission with appropriate feedback', async () => {
    await loginPage.submitButton.click();
    // HTML5 validation or application validation feedback
    const isInvalid = await loginPage.emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('TC-AUTH-03: Form rejects invalid email format', async () => {
    for (const badEmail of SECURITY_PAYLOADS.invalidEmails.slice(0, 3)) {
      await loginPage.emailInput.fill(badEmail);
      await loginPage.passwordInput.fill('ValidPassword123!');
      await loginPage.submitButton.click();
      const isInvalid = await loginPage.emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
      expect(isInvalid).toBe(true);
    }
  });

  test('TC-AUTH-04: Resists SQL Injection and NoSQL Injection payloads safely', async ({ page }) => {
    for (const sqlPayload of SECURITY_PAYLOADS.sqlInjection) {
      await loginPage.emailInput.fill(sqlPayload);
      await loginPage.passwordInput.fill(sqlPayload);
      await loginPage.submitButton.click();
      // Verify app does not crash or expose raw database error stack
      await expect(page.locator('body')).not.toContainText('MongoError');
      await expect(page.locator('body')).not.toContainText('SyntaxError');
    }
  });

  test('TC-AUTH-05: Direct protected URL access redirects to login when unauthenticated', async ({ page }) => {
    // Clear localStorage to ensure fresh session
    await page.evaluate(() => localStorage.clear());
    await page.goto('/dashboard/admin-dashboard');
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });
});

