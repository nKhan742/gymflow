# GymFlow ERP — Enterprise Multi-Tenant Gym Management SaaS

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21+-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.6+-47A248.svg)](https://mongoosejs.com/)

**GymFlow ERP** is a commercial-grade, multi-tenant SaaS Enterprise Resource Planning platform for modern fitness clubs, gym chains, and boutique studios. Designed with an original luxury design language inspired by **Linear, Stripe, Vercel, and Supabase**, GymFlow ERP provides end-to-end management from physical access turnstiles and biometric check-ins to automated billing, trainer scheduling, workout protocols, and POS inventory.

---

## 🏛️ Monorepo Architecture

```
gymflow-erp/
├── apps/
│   ├── web/                     # Frontend Application (@gymflow/web)
│   │   ├── app/
│   │   │   ├── core/            # Auth Store, Theme System, Tokens, Config
│   │   │   ├── modules/         # 16 Business Domains & 84 Modular Submodules
│   │   │   ├── shared/          # Reusable UI Primitives, Layouts, Charts & DataTables
│   │   │   ├── router/          # AppRouter with ProtectedRoute & Code-Splitting
│   │   │   └── main.tsx         # Frontend React bootstrap
│   │   ├── index.html
│   │   ├── vite.config.ts       # Vite configuration with @tailwindcss/vite
│   │   └── package.json
│   │
│   └── api/                     # Backend Application (@gymflow/api)
│       ├── src/
│       │   ├── config/          # App, Database, Redis, Mail, Storage, Security configs
│       │   ├── core/            # Auth, JWT, Winston Logger, Middleware, RBAC, Storage
│       │   ├── database/        # Mongoose connection, BaseModel, BaseRepository
│       │   ├── shared/          # BaseController, BaseService, BaseResponse, BaseValidator
│       │   ├── domains/         # 14 Business Domains & 74 Standardized Submodules
│       │   ├── routes/          # Central Domain Router with Auth & Multi-Tenant guards
│       │   ├── app.ts           # Express Application configuration
│       │   └── server.ts        # HTTP bootstrap server
│       ├── docs/                # Architecture.md, BackendGuide.md, APIStandards.md
│       └── package.json
│
├── package.json                 # Monorepo Workspace Configuration
└── README.md                    # Root Workspace Documentation
```

---

## 🚀 Tech Stack

### Frontend (`apps/web`)
- **Core**: React 18, TypeScript (Strict Mode), Vite 5
- **Design System & Styling**: Tailwind CSS v4, CSS Variables, Design Tokens, Custom Glassmorphism
- **Component Primitives**: Radix UI (`@radix-ui/react-*`), Lucide Icons (`lucide-react`)
- **State Management & Data**: Zustand 4, TanStack Query v5, TanStack Table v8
- **Visual Analytics**: Recharts (Area, Bar, Donut, Gauge charts)
- **Forms & Validation**: React Hook Form, Zod
- **Command & Shortcuts**: CMDK Global Command Palette (`Ctrl + K` / `Cmd + K`)
- **Notifications**: Sonner Rich Toast Engine

### Backend (`apps/api`)
- **Runtime**: Node.js LTS, Express 4, TypeScript
- **Database & Modeling**: MongoDB, Mongoose 8 (Repository Pattern, Soft Deletes, Multi-Tenant Scoping)
- **Security & Authentication**: JWT (Access & Refresh Tokens), bcrypt, Helmet, CORS
- **Logging & Auditing**: Winston structured JSON logger, Morgan HTTP middleware
- **Async Processing & Queues**: Redis (prepared), BullMQ (prepared)
- **File Storage**: Local filesystem, AWS S3 (prepared), Cloudinary (prepared)

---

## 🏢 Business Domains & Modules

GymFlow ERP features **16 full-scale business domains** containing **84 specialized submodules**:

| # | Domain | Submodules | Key Features |
| :--- | :--- | :--- | :--- |
| **1** | **Authentication** | `login`, `register`, `forgot-password`, `reset-password`, `otp` | JWT access/refresh rotation, demo quick-fill logins, session guard |
| **2** | **Dashboard** | `admin-dashboard`, `reception-dashboard`, `trainer-dashboard`, `member-dashboard`, `nutrition-dashboard` | Real-time MRR revenue charts, hourly capacity check-ins, class schedules |
| **3** | **Administration** | `users`, `roles`, `permissions`, `branches`, `audit-logs`, `settings` | Multi-branch management, RBAC matrix, system preferences, audit trail |
| **4** | **Gym Management** | `facilities`, `zones`, `lockers`, `turnstiles`, `access-control`, `operating-hours` | IoT biometric turnstile integration, RFID scanner, locker allocation |
| **5** | **Member Management** | `members`, `memberships`, `renewals`, `freezes`, `transfers`, `attendance` | 360° Salesforce-style profile, membership freezing, biometric attendance |
| **6** | **Fitness & Workouts** | `exercises`, `workout-plans`, `routines`, `assigned-workouts`, `progress-tracking`, `body-composition` | Exercise library, hypertrophy/cardio routines, 1RM calculator, BMI tracking |
| **7** | **Nutrition** | `meals`, `diet-plans`, `macros`, `supplements`, `assigned-diets`, `hydration` | Calorie and macronutrient calculators, custom meal protocols, supplement plans |
| **8** | **CRM & Leads** | `leads`, `trials`, `follow-ups`, `pipeline`, `campaigns`, `feedback` | Sales Kanban pipeline, trial class bookings, automated follow-up reminders |
| **9** | **Finance & Billing** | `invoices`, `payments`, `subscriptions`, `discounts`, `expenses`, `payroll`, `tax` | Automated recurring billing, multi-currency invoices, staff payroll |
| **10** | **Inventory & POS** | `products`, `categories`, `stock-levels`, `suppliers`, `purchase-orders`, `pos` | Point-of-sale terminal, supplement sales, barcode scanning, stock alerts |
| **11** | **Equipment** | `equipment-list`, `maintenance`, `vendors`, `warranty`, `inspections` | Machine telemetry, preventive maintenance schedules, repair work orders |
| **12** | **Scheduling** | `classes`, `trainers`, `calendar`, `bookings`, `room-allocation`, `waitlist` | Visual timetable, trainer private booking, waitlist auto-fill |
| **13** | **Communication** | `announcements`, `notifications`, `sms`, `email-templates`, `chat`, `push` | Broadcast SMS/Email, automated renewal alerts, real-time staff messaging |
| **14** | **Reports** | `revenue-reports`, `attendance-reports`, `membership-reports`, `trainer-reports`, `tax-reports` | Exportable financial summaries, PDF generation, CSV data dumps |
| **15** | **Analytics** | `member-analytics`, `revenue-forecasts`, `retention-analytics`, `class-popularity` | Cohort retention analysis, churn prediction, room utilization heatmaps |
| **16** | **Profile & Settings** | `my-profile`, `security`, `preferences`, `sessions`, `connected-apps` | 2FA security, active device session management, appearance settings |

---

## 🎨 Enterprise Design System

- **Linear & Stripe Quality**: Minimalist aesthetics, calm slate/zinc color palette, high contrast, and refined typography.
- **Dark / Light Mode**: Seamless theme switching with system detection and persistence.
- **Glassmorphism**: Sticky headers and floating panels with `-webkit-backdrop-filter: blur(16px)`.
- **Global Command Palette (`Ctrl + K` / `Cmd + K`)**: Instant search across all modules, members, invoices, schedules, and quick actions.
- **Enterprise DataTable**: Powered by TanStack Table with search filtering, column toggles, export to CSV, and status badges.
- **Member 360° Profile**: Salesforce-style view with 8 specialized tabs (Overview, Attendance, Workouts, Diet, BMI, Invoices, Medical, Documents).

---

## 🔑 Authentication & Demo Credentials

GymFlow ERP comes with built-in enterprise demo profiles for testing all privilege levels:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gymflow.io` | `password123` | Full access across all 16 domains & system settings |
| **Trainer** | `trainer@gymflow.io` | `password123` | Fitness, Diet, Attendance, Scheduling & Member Profiles |
| **Member** | `member@gymflow.io` | `password123` | Personal profile, assigned workouts, diets & classes |

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/gymflow_db`) or MongoDB Atlas

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/gymflow-erp.git
cd gymflow-erp

# Install all workspace dependencies
npm install
```

### 3. Running in Development
```bash
# Start Frontend (Vite on http://localhost:5173)
npm run dev:web

# Start Backend (Express on http://localhost:5000)
npm run dev:api
```

### 4. Building for Production
```bash
# Build both frontend and backend
npm run build

# Build individual workspaces
npm run build:web
npm run build:api
```

### 5. Code Quality & Linting
```bash
# Lint entire monorepo
npm run lint

# Lint individual workspaces
npm run lint:web
npm run lint:api
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/health` | Service health and uptime | ❌ |
| `POST` | `/api/v1/auth/login` | User login (JWT issue) | ❌ |
| `POST` | `/api/v1/auth/logout` | Session invalidation | ❌ |
| `POST` | `/api/v1/auth/refresh` | Token rotation | ❌ |
| `GET` | `/api/v1/auth/me` | Current authenticated user | ✅ |
| `*` | `/api/v1/members/*` | Member management CRUD | ✅ |
| `*` | `/api/v1/finance/*` | Invoices, Payments, Billing | ✅ |
| `*` | `/api/v1/fitness/*` | Workouts, Exercises, Routines | ✅ |
| `*` | `/api/v1/scheduling/*`| Class timetables & Bookings | ✅ |
| `*` | `/api/v1/gym/*` | Facilities, Turnstiles, Lockers | ✅ |

---

## 📄 License

Proprietary Commercial SaaS License — © 2026 GymFlow Technologies. All rights reserved.
