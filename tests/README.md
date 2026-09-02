# 🧪 GymFlow ERP Enterprise Test Automation Framework

This directory contains the production-grade automated testing framework for the GymFlow ERP SaaS platform.

---

## 🏗️ Architecture & Structure

```
tests/
├── e2e/                        # End-to-End Playwright test specifications
│   ├── 01_auth_flow.spec.ts
│   ├── 02_registration_onboarding.spec.ts
│   ├── 03_dashboard_kpis.spec.ts
│   ├── 04_attendance_terminal.spec.ts
│   └── 05_responsive_and_theme.spec.ts
├── api/                        # Integration API tests (Supertest + Jest)
│   ├── health.api.spec.ts
│   ├── auth.api.spec.ts
│   └── domains.api.spec.ts
├── page-objects/               # Page Object Model (POM) abstraction classes
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── AdminDashboardPage.ts
│   └── AttendancePage.ts
├── performance/                # k6 Distributed Load Testing
│   └── k6_load_test.js
├── utils/                      # Test factories, generators, & security payloads
│   ├── testDataGenerator.ts
│   └── securityPayloads.ts
└── playwright.config.ts        # Central Playwright runner configuration
```

---

## 🚀 How to Run Tests

### 1. Run Playwright E2E Test Suite
```bash
# Run all E2E tests headless across all configured browsers (Chromium, Firefox, WebKit, Mobile)
npm run test:e2e

# Run with interactive UI mode and time-travel debugging
npm run test:e2e:ui

# View HTML Test Report & Traces
npm run test:e2e:report
```

### 2. Run API Integration Tests
```bash
npm run test:api
```

### 3. Run Distributed Load / Performance Tests (k6)
```bash
k6 run tests/performance/k6_load_test.js
```

---

## 🛡️ Security & Edge-Case Coverage
- **Fuzzing & Injection Testing**: Tests forms against XSS, SQLi, NoSQL injection, and Unicode payloads.
- **Role & Route Guards**: Enforces strict redirect to `/auth/login` on unauthenticated deep-link accesses.
- **Responsiveness**: Automated tests run across 320px, 375px, 768px, 1280px, and 1920px viewports.

