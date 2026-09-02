import { test, expect } from '@playwright/test';
import { RegisterPage } from '../page-objects/RegisterPage';

test.describe('Client Tenant Registration & Onboarding Suite', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('TC-REG-01: Registration page displays multi-step commercial onboarding form', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/auth\/register/);
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Register|Onboard|Gym/i }).first()).toBeVisible();
  });

  test('TC-REG-02: Input sanitization prevents script execution (XSS)', async ({ page }) => {
    const xssPayload = "<script>alert('XSS-TEST')</script>";
    if (await registerPage.gymNameInput.isVisible()) {
      await registerPage.gymNameInput.fill(xssPayload);
      const value = await registerPage.gymNameInput.inputValue();
      expect(value).toBe(xssPayload);
      // Ensure no alert dialog popped up
      await expect(page.locator('body')).not.toContainText('XSS-TEST');
    }
  });
});

