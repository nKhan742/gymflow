export interface ISidebarMenuItem {
  id: string;
  title: string;
  icon?: string;
  permission?: string;
  path: string;
  children?: ISidebarMenuItem[];
}

export const SIDEBAR_MENU_CONFIG: ISidebarMenuItem[] = [
  {
    id: 'auth',
    title: 'Authentication',
    path: '/auth/login',
    permission: 'auth:view',
    children: [
      {
        id: 'auth-login',
        title: 'Login',
        path: '/auth/login',
        permission: 'auth:login:view',
      },
      {
        id: 'auth-forgot-password',
        title: 'Forgot Password',
        path: '/auth/forgot-password',
        permission: 'auth:forgot-password:view',
      },
      {
        id: 'auth-reset-password',
        title: 'Reset Password',
        path: '/auth/reset-password',
        permission: 'auth:reset-password:view',
      },
      {
        id: 'auth-change-password',
        title: 'Change Password',
        path: '/auth/change-password',
        permission: 'auth:change-password:view',
      },
      {
        id: 'auth-verify-otp',
        title: 'Verify OTP',
        path: '/auth/verify-otp',
        permission: 'auth:verify-otp:view',
      }
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard/admin-dashboard',
    permission: 'dashboard:view',
    children: [
      {
        id: 'dashboard-admin-dashboard',
        title: 'Admin Dashboard',
        path: '/dashboard/admin-dashboard',
        permission: 'dashboard:admin-dashboard:view',
      },
      {
        id: 'dashboard-reception-dashboard',
        title: 'Reception Dashboard',
        path: '/dashboard/reception-dashboard',
        permission: 'dashboard:reception-dashboard:view',
      },
      {
        id: 'dashboard-trainer-dashboard',
        title: 'Trainer Dashboard',
        path: '/dashboard/trainer-dashboard',
        permission: 'dashboard:trainer-dashboard:view',
      },
      {
        id: 'dashboard-nutrition-dashboard',
        title: 'Nutrition Dashboard',
        path: '/dashboard/nutrition-dashboard',
        permission: 'dashboard:nutrition-dashboard:view',
      },
      {
        id: 'dashboard-accountant-dashboard',
        title: 'Accountant Dashboard',
        path: '/dashboard/accountant-dashboard',
        permission: 'dashboard:accountant-dashboard:view',
      },
      {
        id: 'dashboard-member-dashboard',
        title: 'Member Dashboard',
        path: '/dashboard/member-dashboard',
        permission: 'dashboard:member-dashboard:view',
      }
    ],
  },
  {
    id: 'administration',
    title: 'Administration',
    path: '/administration/users',
    permission: 'administration:view',
    children: [
      {
        id: 'administration-platform-tenants',
        title: 'Platform Tenants & Subscriptions',
        path: '/administration/platform-tenants',
        permission: 'administration:users:view',
      },
      {
        id: 'administration-users',
        title: 'Users',
        path: '/administration/users',
        permission: 'administration:users:view',
      },
      {
        id: 'administration-roles',
        title: 'Roles',
        path: '/administration/roles',
        permission: 'administration:roles:view',
      },
      {
        id: 'administration-permissions',
        title: 'Permissions',
        path: '/administration/permissions',
        permission: 'administration:permissions:view',
      },
      {
        id: 'administration-activity-logs',
        title: 'Activity Logs',
        path: '/administration/activity-logs',
        permission: 'administration:activity-logs:view',
      },
      {
        id: 'administration-audit-logs',
        title: 'Audit Logs',
        path: '/administration/audit-logs',
        permission: 'administration:audit-logs:view',
      },
      {
        id: 'administration-settings',
        title: 'Settings',
        path: '/administration/settings',
        permission: 'administration:settings:view',
      },
      {
        id: 'administration-system-configuration',
        title: 'System Configuration',
        path: '/administration/system-configuration',
        permission: 'administration:system-configuration:view',
      }
    ],
  },
  {
    id: 'gym-management',
    title: 'Gym Management',
    path: '/gym-management/gym-profile',
    permission: 'gym-management:view',
    children: [
      {
        id: 'gym-management-gym-profile',
        title: 'Gym Profile',
        path: '/gym-management/gym-profile',
        permission: 'gym-management:gym-profile:view',
      },
      {
        id: 'gym-management-branches',
        title: 'Branches',
        path: '/gym-management/branches',
        permission: 'gym-management:branches:view',
      },
      {
        id: 'gym-management-departments',
        title: 'Departments',
        path: '/gym-management/departments',
        permission: 'gym-management:departments:view',
      },
      {
        id: 'gym-management-staff',
        title: 'Staff',
        path: '/gym-management/staff',
        permission: 'gym-management:staff:view',
      },
      {
        id: 'gym-management-shift-management',
        title: 'Shift Management',
        path: '/gym-management/shift-management',
        permission: 'gym-management:shift-management:view',
      },
      {
        id: 'gym-management-holidays',
        title: 'Holidays',
        path: '/gym-management/holidays',
        permission: 'gym-management:holidays:view',
      },
      {
        id: 'gym-management-working-hours',
        title: 'Working Hours',
        path: '/gym-management/working-hours',
        permission: 'gym-management:working-hours:view',
      },
      {
        id: 'gym-management-partners',
        title: 'Gym Partners',
        path: '/gym-management/partners',
        permission: 'gym-management:partners:view',
      },
      {
        id: 'gym-management-floors-zones',
        title: 'Floors & Zones',
        path: '/gym-management/floors-zones',
        permission: 'gym-management:floors-zones:view',
      },
      {
        id: 'gym-management-access-control',
        title: 'Physical Access Control',
        path: '/gym-management/access-control',
        permission: 'gym-management:access-control:view',
      }
    ],
  },
  {
    id: 'member-management',
    title: 'Member Management',
    path: '/member-management/members',
    permission: 'member-management:view',
    children: [
      {
        id: 'member-management-members',
        title: 'Members',
        path: '/member-management/members',
        permission: 'member-management:members:view',
      },
      {
        id: 'member-management-membership-plans',
        title: 'Membership Plans',
        path: '/member-management/membership-plans',
        permission: 'member-management:membership-plans:view',
      },
      {
        id: 'member-management-membership-renewals',
        title: 'Membership Renewals',
        path: '/member-management/membership-renewals',
        permission: 'member-management:membership-renewals:view',
      },
      {
        id: 'member-management-attendance',
        title: 'Attendance',
        path: '/member-management/attendance',
        permission: 'member-management:attendance:view',
      },
      {
        id: 'member-management-freeze-membership',
        title: 'Freeze Membership',
        path: '/member-management/freeze-membership',
        permission: 'member-management:freeze-membership:view',
      },
      {
        id: 'member-management-bmi',
        title: 'BMI Assessment',
        path: '/member-management/bmi',
        permission: 'member-management:bmi:view',
      },
      {
        id: 'member-management-body-measurements',
        title: 'Body Measurements',
        path: '/member-management/body-measurements',
        permission: 'member-management:body-measurements:view',
      },
      {
        id: 'member-management-progress',
        title: 'Client Progress',
        path: '/member-management/progress',
        permission: 'member-management:progress:view',
      },
      {
        id: 'member-management-transformation',
        title: 'Transformations',
        path: '/member-management/transformation',
        permission: 'member-management:transformation:view',
      },
      {
        id: 'member-management-medical-history',
        title: 'Medical History',
        path: '/member-management/medical-history',
        permission: 'member-management:medical-history:view',
      },
      {
        id: 'member-management-emergency-contacts',
        title: 'Emergency Contacts',
        path: '/member-management/emergency-contacts',
        permission: 'member-management:emergency-contacts:view',
      },
      {
        id: 'member-management-documents',
        title: 'Member Documents',
        path: '/member-management/documents',
        permission: 'member-management:documents:view',
      }
    ],
  },
  {
    id: 'fitness',
    title: 'Fitness',
    path: '/fitness/exercise-categories',
    permission: 'fitness:view',
    children: [
      {
        id: 'fitness-exercise-categories',
        title: 'Exercise Categories',
        path: '/fitness/exercise-categories',
        permission: 'fitness:exercise-categories:view',
      },
      {
        id: 'fitness-exercise-library',
        title: 'Exercise Library',
        path: '/fitness/exercise-library',
        permission: 'fitness:exercise-library:view',
      },
      {
        id: 'fitness-workout-templates',
        title: 'Workout Templates',
        path: '/fitness/workout-templates',
        permission: 'fitness:workout-templates:view',
      },
      {
        id: 'fitness-workout-plans',
        title: 'Workout Plans',
        path: '/fitness/workout-plans',
        permission: 'fitness:workout-plans:view',
      },
      {
        id: 'fitness-workout-assignment',
        title: 'Workout Assignment',
        path: '/fitness/workout-assignment',
        permission: 'fitness:workout-assignment:view',
      },
      {
        id: 'fitness-fitness-assessment',
        title: 'Fitness Assessment',
        path: '/fitness/fitness-assessment',
        permission: 'fitness:fitness-assessment:view',
      },
      {
        id: 'fitness-personal-training',
        title: 'Personal Training',
        path: '/fitness/personal-training',
        permission: 'fitness:personal-training:view',
      },
      {
        id: 'fitness-group-classes',
        title: 'Group Classes',
        path: '/fitness/group-classes',
        permission: 'fitness:group-classes:view',
      },
      {
        id: 'fitness-class-booking',
        title: 'Class Booking',
        path: '/fitness/class-booking',
        permission: 'fitness:class-booking:view',
      }
    ],
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    path: '/nutrition/meal-library',
    permission: 'nutrition:view',
    children: [
      {
        id: 'nutrition-meal-library',
        title: 'Meal Library',
        path: '/nutrition/meal-library',
        permission: 'nutrition:meal-library:view',
      },
      {
        id: 'nutrition-diet-plans',
        title: 'Diet Plans',
        path: '/nutrition/diet-plans',
        permission: 'nutrition:diet-plans:view',
      },
      {
        id: 'nutrition-nutrition-tracking',
        title: 'Nutrition Tracking',
        path: '/nutrition/nutrition-tracking',
        permission: 'nutrition:nutrition-tracking:view',
      },
      {
        id: 'nutrition-water-intake',
        title: 'Water Intake',
        path: '/nutrition/water-intake',
        permission: 'nutrition:water-intake:view',
      }
    ],
  },
  {
    id: 'crm',
    title: 'CRM',
    path: '/crm/leads',
    permission: 'crm:view',
    children: [
      {
        id: 'crm-leads',
        title: 'Leads',
        path: '/crm/leads',
        permission: 'crm:leads:view',
      },
      {
        id: 'crm-follow-ups',
        title: 'Follow Ups',
        path: '/crm/follow-ups',
        permission: 'crm:follow-ups:view',
      },
      {
        id: 'crm-visitors',
        title: 'Visitors',
        path: '/crm/visitors',
        permission: 'crm:visitors:view',
      },
      {
        id: 'crm-trial-members',
        title: 'Trial Members',
        path: '/crm/trial-members',
        permission: 'crm:trial-members:view',
      },
      {
        id: 'crm-referrals',
        title: 'Referrals',
        path: '/crm/referrals',
        permission: 'crm:referrals:view',
      },
      {
        id: 'crm-campaigns',
        title: 'Campaigns',
        path: '/crm/campaigns',
        permission: 'crm:campaigns:view',
      },
      {
        id: 'crm-tasks',
        title: 'Tasks',
        path: '/crm/tasks',
        permission: 'crm:tasks:view',
      }
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    path: '/finance/payments',
    permission: 'finance:view',
    children: [
      {
        id: 'finance-payments',
        title: 'Payments',
        path: '/finance/payments',
        permission: 'finance:payments:view',
      },
      {
        id: 'finance-invoices',
        title: 'Invoices',
        path: '/finance/invoices',
        permission: 'finance:invoices:view',
      },
      {
        id: 'finance-expenses',
        title: 'Expenses',
        path: '/finance/expenses',
        permission: 'finance:expenses:view',
      },
      {
        id: 'finance-salary',
        title: 'Salary',
        path: '/finance/salary',
        permission: 'finance:salary:view',
      },
      {
        id: 'finance-trainer-commission',
        title: 'Trainer Commission',
        path: '/finance/trainer-commission',
        permission: 'finance:trainer-commission:view',
      },
      {
        id: 'finance-pos',
        title: 'Point of Sale',
        path: '/finance/pos',
        permission: 'finance:pos:view',
      },
      {
        id: 'finance-discounts',
        title: 'Discounts',
        path: '/finance/discounts',
        permission: 'finance:discounts:view',
      },
      {
        id: 'finance-wallet',
        title: 'Member Wallet',
        path: '/finance/wallet',
        permission: 'finance:wallet:view',
      },
      {
        id: 'finance-taxes',
        title: 'Tax Settings',
        path: '/finance/taxes',
        permission: 'finance:taxes:view',
      }
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory',
    path: '/inventory/products',
    permission: 'inventory:view',
    children: [
      {
        id: 'inventory-products',
        title: 'Products',
        path: '/inventory/products',
        permission: 'inventory:products:view',
      },
      {
        id: 'inventory-categories',
        title: 'Product Categories',
        path: '/inventory/categories',
        permission: 'inventory:categories:view',
      },
      {
        id: 'inventory-suppliers',
        title: 'Suppliers',
        path: '/inventory/suppliers',
        permission: 'inventory:suppliers:view',
      },
      {
        id: 'inventory-purchases',
        title: 'Purchases',
        path: '/inventory/purchases',
        permission: 'inventory:purchases:view',
      },
      {
        id: 'inventory-inventory-stock',
        title: 'Inventory Stock',
        path: '/inventory/inventory-stock',
        permission: 'inventory:inventory-stock:view',
      },
      {
        id: 'inventory-stock-adjustment',
        title: 'Stock Adjustment',
        path: '/inventory/stock-adjustment',
        permission: 'inventory:stock-adjustment:view',
      }
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    path: '/equipment/equipment-list',
    permission: 'equipment:view',
    children: [
      {
        id: 'equipment-equipment-list',
        title: 'Equipment Assets',
        path: '/equipment/equipment-list',
        permission: 'equipment:equipment-list:view',
      },
      {
        id: 'equipment-maintenance',
        title: 'Maintenance Tickets',
        path: '/equipment/maintenance',
        permission: 'equipment:maintenance:view',
      },
      {
        id: 'equipment-service-history',
        title: 'Service History',
        path: '/equipment/service-history',
        permission: 'equipment:service-history:view',
      }
    ],
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    path: '/scheduling/calendar',
    permission: 'scheduling:view',
    children: [
      {
        id: 'scheduling-calendar',
        title: 'Master Calendar',
        path: '/scheduling/calendar',
        permission: 'scheduling:calendar:view',
      },
      {
        id: 'scheduling-trainer-schedule',
        title: 'Trainer Schedule',
        path: '/scheduling/trainer-schedule',
        permission: 'scheduling:trainer-schedule:view',
      },
      {
        id: 'scheduling-appointments',
        title: 'Appointments',
        path: '/scheduling/appointments',
        permission: 'scheduling:appointments:view',
      },
      {
        id: 'scheduling-resource-booking',
        title: 'Resource Booking',
        path: '/scheduling/resource-booking',
        permission: 'scheduling:resource-booking:view',
      }
    ],
  },
  {
    id: 'communication',
    title: 'Communication',
    path: '/communication/notifications',
    permission: 'communication:view',
    children: [
      {
        id: 'communication-notifications',
        title: 'Notifications',
        path: '/communication/notifications',
        permission: 'communication:notifications:view',
      },
      {
        id: 'communication-announcements',
        title: 'Announcements',
        path: '/communication/announcements',
        permission: 'communication:announcements:view',
      },
      {
        id: 'communication-email',
        title: 'Email Broadcasts',
        path: '/communication/email',
        permission: 'communication:email:view',
      },
      {
        id: 'communication-sms',
        title: 'SMS Gateway',
        path: '/communication/sms',
        permission: 'communication:sms:view',
      },
      {
        id: 'communication-whatsapp',
        title: 'WhatsApp Integration',
        path: '/communication/whatsapp',
        permission: 'communication:whatsapp:view',
      }
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    path: '/reports/revenue-reports',
    permission: 'reports:view',
    children: [
      {
        id: 'reports-revenue-reports',
        title: 'Revenue Reports',
        path: '/reports/revenue-reports',
        permission: 'reports:revenue-reports:view',
      },
      {
        id: 'reports-attendance-reports',
        title: 'Attendance Reports',
        path: '/reports/attendance-reports',
        permission: 'reports:attendance-reports:view',
      },
      {
        id: 'reports-membership-reports',
        title: 'Membership Reports',
        path: '/reports/membership-reports',
        permission: 'reports:membership-reports:view',
      },
      {
        id: 'reports-trainer-reports',
        title: 'Trainer Reports',
        path: '/reports/trainer-reports',
        permission: 'reports:trainer-reports:view',
      },
      {
        id: 'reports-inventory-reports',
        title: 'Inventory Reports',
        path: '/reports/inventory-reports',
        permission: 'reports:inventory-reports:view',
      },
      {
        id: 'reports-finance-reports',
        title: 'Finance Reports',
        path: '/reports/finance-reports',
        permission: 'reports:finance-reports:view',
      }
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    path: '/analytics/dashboard-analytics',
    permission: 'analytics:view',
    children: [
      {
        id: 'analytics-dashboard-analytics',
        title: 'Dashboard Analytics',
        path: '/analytics/dashboard-analytics',
        permission: 'analytics:dashboard-analytics:view',
      },
      {
        id: 'analytics-revenue-analytics',
        title: 'Revenue Analytics',
        path: '/analytics/revenue-analytics',
        permission: 'analytics:revenue-analytics:view',
      },
      {
        id: 'analytics-attendance-analytics',
        title: 'Attendance Analytics',
        path: '/analytics/attendance-analytics',
        permission: 'analytics:attendance-analytics:view',
      },
      {
        id: 'analytics-member-analytics',
        title: 'Member Analytics',
        path: '/analytics/member-analytics',
        permission: 'analytics:member-analytics:view',
      },
      {
        id: 'analytics-trainer-analytics',
        title: 'Trainer Analytics',
        path: '/analytics/trainer-analytics',
        permission: 'analytics:trainer-analytics:view',
      }
    ],
  },
  {
    id: 'profile',
    title: 'Profile',
    path: '/profile/my-profile',
    permission: 'profile:view',
    children: [
      {
        id: 'profile-my-profile',
        title: 'My Profile',
        path: '/profile/my-profile',
        permission: 'profile:my-profile:view',
      },
      {
        id: 'profile-profile-change-password',
        title: 'Change Password',
        path: '/profile/profile-change-password',
        permission: 'profile:profile-change-password:view',
      },
      {
        id: 'profile-profile-notifications',
        title: 'Notification Preferences',
        path: '/profile/profile-notifications',
        permission: 'profile:profile-notifications:view',
      },
      {
        id: 'profile-profile-preferences',
        title: 'App Preferences',
        path: '/profile/profile-preferences',
        permission: 'profile:profile-preferences:view',
      }
    ],
  }
];
