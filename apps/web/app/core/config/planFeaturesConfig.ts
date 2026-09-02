export type PlanTier = 'ESSENTIAL' | 'PROFESSIONAL' | 'ENTERPRISE';
export type BillingCycle = 'MONTHLY' | 'ANNUAL';

export interface IPlanPricing {
  monthlyINR: number;
  annualINR: number;
  annualSavingsINR: number;
  taxNote: string;
}

export interface IPlanDefinition {
  id: PlanTier;
  name: string;
  tagline: string;
  bestFor: string;
  recommended?: boolean;
  pricing: IPlanPricing;
  limits: {
    maxBranches: number; // 1 or 999
    maxTrainers: number; // 2 or 999
    monthlyWhatsAppQuota: number; // 100, 1500, 5000
    multiFloorEnabled: boolean;
    hardwareAccessControl: boolean;
    partnerManagement: boolean;
  };
  features: {
    category: string;
    items: string[];
  }[];
}

export const PLAN_DEFINITIONS: Record<PlanTier, IPlanDefinition> = {
  ESSENTIAL: {
    id: 'ESSENTIAL',
    name: 'Essential Plan',
    tagline: 'Simple & Efficient Digital Management',
    bestFor: 'Gyms looking for simple and efficient digital management.',
    pricing: {
      monthlyINR: 1500,
      annualINR: 15000,
      annualSavingsINR: 3000,
      taxNote: '+ GST',
    },
    limits: {
      maxBranches: 1,
      maxTrainers: 3,
      monthlyWhatsAppQuota: 100,
      multiFloorEnabled: false,
      hardwareAccessControl: false,
      partnerManagement: false,
    },
    features: [
      {
        category: 'Member & Membership',
        items: [
          'Unlimited member database',
          'Member 360° profiles',
          'Membership plan management',
          'Membership renewal & expiry tracking',
          'Freeze/Pause membership',
          'QR-based member check-in',
          'Attendance management',
          'Basic attendance reports',
        ],
      },
      {
        category: 'Leads & CRM',
        items: ['Lead & enquiry management', 'Trial membership management'],
      },
      {
        category: 'Trainers & Workouts',
        items: [
          'Basic trainer management',
          'Trainer-wise member allocation',
          'Basic workout plan management',
        ],
      },
      {
        category: 'Billing & Notifications',
        items: [
          'Payment recording (Cash / UPI / Card)',
          'Invoice & receipt generation',
          'Basic expense management',
          'Renewal notifications',
          'Basic WhatsApp notifications (100 msgs/mo)',
        ],
      },
      {
        category: 'Dashboards & System',
        items: [
          'Admin Dashboard',
          'Reception Dashboard',
          'Role-based access control',
          'Cloud backup',
        ],
      },
    ],
  },
  PROFESSIONAL: {
    id: 'PROFESSIONAL',
    name: 'Professional Plan',
    tagline: 'Advanced Performance & Growth Hub',
    bestFor: 'Established gyms with multiple trainers and higher operational requirements.',
    recommended: true,
    pricing: {
      monthlyINR: 2500,
      annualINR: 25000,
      annualSavingsINR: 5000,
      taxNote: '+ GST',
    },
    limits: {
      maxBranches: 1,
      maxTrainers: 15,
      monthlyWhatsAppQuota: 1500,
      multiFloorEnabled: false,
      hardwareAccessControl: false,
      partnerManagement: false,
    },
    features: [
      {
        category: 'Everything in Essential, plus:',
        items: [
          'Advanced member profiles & dues tracking',
          'Membership packages & add-ons',
          'Attendance analytics & member progress',
          'Multiple trainer accounts & schedules',
          'Trainer attendance & commission tracking',
          'Personal Training (PT) packages & session tracking',
          'Trainer-wise revenue & performance reports',
        ],
      },
      {
        category: 'Fitness & Nutrition',
        items: [
          'Workout routine builder & exercise library',
          'Workout assignment',
          'Indian Veg / Non-Veg diet planner',
          'Meal planning, calorie & macro tracking',
          'Body measurement tracking & progress reports',
        ],
      },
      {
        category: 'CRM & WhatsApp Automation',
        items: [
          'Lead pipeline & walk-in enquiries',
          'Trial follow-ups & renewal reminders',
          'Inactive-member alerts & occasion messages',
          'Payment confirmation & invoice delivery',
          'Up to 1,500 WhatsApp messages/month',
        ],
      },
      {
        category: 'Billing & POS',
        items: [
          'GST-compliant invoices & POS billing',
          'Product inventory & barcode sales',
          'Supplement/Merchandise sales & low-stock alerts',
          'Daily collection & revenue reports',
        ],
      },
      {
        category: 'Dashboards & Analytics',
        items: [
          'Owner Dashboard',
          'Trainer Dashboard',
          'Reception Dashboard',
          'Accountant Dashboard',
          'Advanced reports & permissions',
        ],
      },
    ],
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise Plan',
    tagline: 'Multi-Floor, Hardware & Multi-Branch Power',
    bestFor: 'Large gyms with multiple trainers, partners, multiple floors, and advanced operational requirements.',
    pricing: {
      monthlyINR: 3000,
      annualINR: 30000,
      annualSavingsINR: 6000,
      taxNote: '+ GST',
    },
    limits: {
      maxBranches: 999,
      maxTrainers: 999,
      monthlyWhatsAppQuota: 5000,
      multiFloorEnabled: true,
      hardwareAccessControl: true,
      partnerManagement: true,
    },
    features: [
      {
        category: 'Everything in Professional, plus:',
        items: [
          'Unlimited trainer accounts & collections',
          'Trainer performance dashboard & conversion analytics',
          'Multi-branch ready (Centralized owner dashboard)',
          'Global member search & branch switching',
          'Branch-level permissions & cross-branch access',
        ],
      },
      {
        category: 'Gym Partner Management',
        items: [
          'Multiple gym partner profiles',
          'Partner/Referral tracking & member attribution',
          'Revenue sharing & commission configuration',
          'Partner settlement reports & performance dashboard',
        ],
      },
      {
        category: 'Two-Floor & Zone Management',
        items: [
          'Floor-wise operational management',
          'Floor/Zone configuration (Cardio, Strength, CrossFit)',
          'Trainer & member allocation by floor/zone',
          'Floor-wise attendance reports & capacity monitoring',
        ],
      },
      {
        category: 'Physical Access Control',
        items: [
          'QR, RFID & Biometric access integration',
          'Turnstile & ZKTeco / eSSL controller integration',
          'Membership-status validation & expired access block',
          'Real-time entry logs & gate-wise reports',
        ],
      },
      {
        category: 'Advanced Owner Suite & Automation',
        items: [
          'Real-time revenue, collections & profitability reports',
          'Floor-wise attendance & lead conversion analytics',
          'Automated renewal campaigns & inactive win-backs',
          'Workout & diet delivery via WhatsApp',
          'Up to 5,000 WhatsApp messages/month',
          'Priority implementation & dedicated support',
        ],
      },
    ],
  },
};

/**
 * Feature-to-minimum-tier gating map.
 * Key is the module/submodule path or identifier.
 */
export const FEATURE_TIER_REQUIREMENTS: Record<string, PlanTier> = {
  // Enterprise Exclusive Features
  'gym-management/branches': 'ENTERPRISE',
  'gym-management/floors-zones': 'ENTERPRISE',
  'gym-management/access-control': 'ENTERPRISE',
  'gym-management/partners': 'ENTERPRISE',
  'crm/campaigns': 'ENTERPRISE',

  // Professional Features (and above)
  'finance/pos': 'PROFESSIONAL',
  'inventory/products': 'PROFESSIONAL',
  'inventory/categories': 'PROFESSIONAL',
  'inventory/suppliers': 'PROFESSIONAL',
  'inventory/purchases': 'PROFESSIONAL',
  'inventory/inventory-stock': 'PROFESSIONAL',
  'inventory/stock-adjustment': 'PROFESSIONAL',
  'fitness/exercise-library': 'PROFESSIONAL',
  'fitness/workout-templates': 'PROFESSIONAL',
  'fitness/personal-training': 'PROFESSIONAL',
  'fitness/group-classes': 'PROFESSIONAL',
  'fitness/class-booking': 'PROFESSIONAL',
  'nutrition/meal-library': 'PROFESSIONAL',
  'nutrition/diet-plans': 'PROFESSIONAL',
  'nutrition/nutrition-tracking': 'PROFESSIONAL',
  'nutrition/water-intake': 'PROFESSIONAL',
  'scheduling/trainer-schedule': 'PROFESSIONAL',
  'scheduling/appointments': 'PROFESSIONAL',
  'scheduling/resource-booking': 'PROFESSIONAL',
  'finance/trainer-commission': 'PROFESSIONAL',
  'analytics/dashboard-analytics': 'PROFESSIONAL',
  'analytics/revenue-analytics': 'PROFESSIONAL',
  'analytics/attendance-analytics': 'PROFESSIONAL',
  'analytics/member-analytics': 'PROFESSIONAL',
  'analytics/trainer-analytics': 'PROFESSIONAL',
  'dashboard/trainer-dashboard': 'PROFESSIONAL',
  'dashboard/accountant-dashboard': 'PROFESSIONAL',
  'member-management/progress': 'PROFESSIONAL',
  'member-management/transformation': 'PROFESSIONAL',
  'member-management/body-measurements': 'PROFESSIONAL',
  'member-management/bmi': 'PROFESSIONAL',

  // Essential Features (Available to all)
  'member-management/members': 'ESSENTIAL',
  'member-management/membership-plans': 'ESSENTIAL',
  'member-management/membership-renewals': 'ESSENTIAL',
  'member-management/attendance': 'ESSENTIAL',
  'member-management/freeze-membership': 'ESSENTIAL',
  'member-management/medical-history': 'ESSENTIAL',
  'member-management/emergency-contacts': 'ESSENTIAL',
  'member-management/documents': 'ESSENTIAL',
  'crm/leads': 'ESSENTIAL',
  'crm/trial-members': 'ESSENTIAL',
  'crm/visitors': 'ESSENTIAL',
  'crm/follow-ups': 'ESSENTIAL',
  'crm/referrals': 'ESSENTIAL',
  'crm/tasks': 'ESSENTIAL',
  'gym-management/gym-profile': 'ESSENTIAL',
  'gym-management/departments': 'ESSENTIAL',
  'gym-management/staff': 'ESSENTIAL',
  'gym-management/shift-management': 'ESSENTIAL',
  'gym-management/holidays': 'ESSENTIAL',
  'gym-management/working-hours': 'ESSENTIAL',
  'fitness/exercise-categories': 'ESSENTIAL',
  'fitness/workout-plans': 'ESSENTIAL',
  'fitness/workout-assignment': 'ESSENTIAL',
  'fitness/fitness-assessment': 'ESSENTIAL',
  'finance/payments': 'ESSENTIAL',
  'finance/invoices': 'ESSENTIAL',
  'finance/expenses': 'ESSENTIAL',
  'finance/salary': 'ESSENTIAL',
  'finance/discounts': 'ESSENTIAL',
  'finance/wallet': 'ESSENTIAL',
  'finance/taxes': 'ESSENTIAL',
  'dashboard/admin-dashboard': 'ESSENTIAL',
  'dashboard/reception-dashboard': 'ESSENTIAL',
  'dashboard/member-dashboard': 'ESSENTIAL',
  'communication/notifications': 'ESSENTIAL',
  'communication/announcements': 'ESSENTIAL',
  'communication/email': 'ESSENTIAL',
  'communication/sms': 'ESSENTIAL',
  'communication/whatsapp': 'ESSENTIAL',
  'reports/attendance-reports': 'ESSENTIAL',
  'reports/membership-reports': 'ESSENTIAL',
  'reports/revenue-reports': 'ESSENTIAL',
  'reports/finance-reports': 'ESSENTIAL',
  'reports/trainer-reports': 'ESSENTIAL',
  'reports/inventory-reports': 'ESSENTIAL',
  'administration/users': 'ESSENTIAL',
  'administration/roles': 'ESSENTIAL',
  'administration/permissions': 'ESSENTIAL',
  'administration/activity-logs': 'ESSENTIAL',
  'administration/audit-logs': 'ESSENTIAL',
  'administration/settings': 'ESSENTIAL',
  'administration/system-configuration': 'ESSENTIAL',
};

export const TIER_WEIGHT: Record<PlanTier, number> = {
  ESSENTIAL: 1,
  PROFESSIONAL: 2,
  ENTERPRISE: 3,
};
