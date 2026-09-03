export interface IPermissionItem {
  code: string;
  name: string;
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'SIGN_OFF';
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface IModuleDefinition {
  key: string;
  label: string;
  desc: string;
  icon: string;
  prefixes: string[];
  capabilities: IPermissionItem[];
}

export const AVAILABLE_MODULE_PERMISSIONS: Record<string, IModuleDefinition> = {
  gym_mgmt: {
    key: 'gym_mgmt',
    label: '🏢 Gym Management & Multi-Branch Network',
    desc: 'Campuses, multi-branch routing, staff rosters, departments, and shifts',
    icon: 'Building2',
    prefixes: ['gym:', 'gym_mgmt', 'branches:', 'departments:', 'staff:', 'shifts:', 'shift-management:', 'holidays:', 'working-hours:'],
    capabilities: [
      { code: 'gym:branches:view', name: 'View Facility Branches', action: 'VIEW', risk: 'LOW' },
      { code: 'gym:departments:view', name: 'View Operational Departments', action: 'VIEW', risk: 'LOW' },
      { code: 'gym:staff:view', name: 'Access Employee & Coach Directory', action: 'VIEW', risk: 'MEDIUM' },
      { code: 'gym:staff:create', name: 'Provision Staff & Contract Profiles', action: 'CREATE', risk: 'HIGH' },
      { code: 'gym:shifts:view', name: 'View Shift Scheduling & Rosters', action: 'VIEW', risk: 'LOW' },
      { code: 'gym:holidays:manage', name: 'Configure Facility Holiday Schedules', action: 'UPDATE', risk: 'MEDIUM' },
    ],
  },
  members: {
    key: 'members',
    label: '👥 Member Management & Access Control',
    desc: 'Member roster, membership contracts, RFID turnstiles, and KYC',
    icon: 'Users',
    prefixes: ['members:', 'member-management:', 'membership-plans:', 'attendance:', 'freeze:', 'profile:'],
    capabilities: [
      { code: 'members:members:view', name: 'View Member Directory & Status', action: 'VIEW', risk: 'LOW' },
      { code: 'members:members:create', name: 'Register & Onboard New Members', action: 'CREATE', risk: 'MEDIUM' },
      { code: 'members:members:update', name: 'Modify Member Records & Contracts', action: 'UPDATE', risk: 'MEDIUM' },
      { code: 'members:attendance:view', name: 'Inspect Turnstile & Biometric Logs', action: 'VIEW', risk: 'LOW' },
      { code: 'members:freeze:manage', name: 'Execute Medical / Travel Freezes', action: 'UPDATE', risk: 'HIGH' },
    ],
  },
  fitness: {
    key: 'fitness',
    label: '🏋️ Fitness Workouts & Exercise Programs',
    desc: 'Exercise catalog, workout regimens, body assessments, and personal coaching',
    icon: 'Dumbbell',
    prefixes: ['fitness:', 'exercise:', 'workout:', 'pt:'],
    capabilities: [
      { code: 'fitness:exercise-categories:view', name: 'View Exercise Anatomy Categories', action: 'VIEW', risk: 'LOW' },
      { code: 'fitness:exercise-library:view', name: 'Browse Exercise Movement Video Library', action: 'VIEW', risk: 'LOW' },
      { code: 'fitness:workout-templates:view', name: 'View Workout Routine Templates', action: 'VIEW', risk: 'LOW' },
      { code: 'fitness:workout-plans:view', name: 'Inspect Member Workout Programs', action: 'VIEW', risk: 'LOW' },
      { code: 'fitness:workout-plans:create', name: 'Prescribe & Assign Custom Workouts', action: 'CREATE', risk: 'MEDIUM' },
      { code: 'fitness:fitness-assessment:view', name: 'Conduct Biometric & VO2 Fitness Audits', action: 'UPDATE', risk: 'MEDIUM' },
    ],
  },
  nutrition: {
    key: 'nutrition',
    label: '🥗 Nutrition, Meal Protocols & Diet Plans',
    desc: 'Dietary calculations, macro assignments, recipe database, and hydration',
    icon: 'Utensils',
    prefixes: ['nutrition:', 'diet:', 'meal:', 'tracking:'],
    capabilities: [
      { code: 'nutrition:meal-library:view', name: 'View Nutritional Food & Meal Library', action: 'VIEW', risk: 'LOW' },
      { code: 'nutrition:meal-library:create', name: 'Formulate Custom Macronutrient Meals', action: 'CREATE', risk: 'LOW' },
      { code: 'nutrition:diet-plans:view', name: 'View Member Clinical Diet Regimens', action: 'VIEW', risk: 'LOW' },
      { code: 'nutrition:diet-plans:create', name: 'Prescribe Clinical Dietary Protocols', action: 'CREATE', risk: 'HIGH' },
      { code: 'nutrition:nutrition-tracking:view', name: 'Monitor Daily Caloric & Hydration Logs', action: 'VIEW', risk: 'LOW' },
    ],
  },
  scheduling: {
    key: 'scheduling',
    label: '📅 Class Scheduling & Master Calendar',
    desc: 'Instructor studio sessions, trainer bookings, court reservations, and timetable',
    icon: 'Calendar',
    prefixes: ['scheduling:', 'calendar:', 'classes:', 'appointments:', 'booking:'],
    capabilities: [
      { code: 'scheduling:calendar:view', name: 'Access Master Facility Timetable', action: 'VIEW', risk: 'LOW' },
      { code: 'scheduling:classes:view', name: 'View Studio Group Class Rosters', action: 'VIEW', risk: 'LOW' },
      { code: 'scheduling:classes:create', name: 'Publish Weekly Studio Schedule', action: 'CREATE', risk: 'MEDIUM' },
      { code: 'scheduling:appointments:view', name: 'Manage Coach 1-on-1 Appointments', action: 'VIEW', risk: 'LOW' },
      { code: 'scheduling:resource-booking:view', name: 'Reserve Studios, Saunas & Courts', action: 'UPDATE', risk: 'LOW' },
    ],
  },
  finance: {
    key: 'finance',
    label: '💳 Finance, Tax Invoices & POS Register',
    desc: 'Automated billing, GAAP invoices, salary disbursements, and front desk register',
    icon: 'CreditCard',
    prefixes: ['finance:', 'payments:', 'invoices:', 'salary:', 'pos:', 'wallet:', 'taxes:'],
    capabilities: [
      { code: 'finance:payments:view', name: 'Audit Payment Ledger & Settlements', action: 'VIEW', risk: 'HIGH' },
      { code: 'finance:invoices:view', name: 'View Tax Invoices & Member Receipts', action: 'VIEW', risk: 'MEDIUM' },
      { code: 'finance:invoices:sign', name: 'Sign GAAP Tax Invoices & Settlements', action: 'SIGN_OFF', risk: 'CRITICAL' },
      { code: 'finance:pos:view', name: 'Operate Retail & Front Desk Register', action: 'UPDATE', risk: 'MEDIUM' },
      { code: 'finance:salary:view', name: 'Inspect Coach Payroll & Commissions', action: 'VIEW', risk: 'HIGH' },
    ],
  },
  inventory: {
    key: 'inventory',
    label: '📦 Inventory Valuation & Equipment Assets',
    desc: 'Retail supplements, supplier orders, machine warranties, and maintenance',
    icon: 'Package',
    prefixes: ['inventory:', 'equipment:', 'suppliers:', 'products:', 'stock:', 'maintenance:'],
    capabilities: [
      { code: 'inventory:products:view', name: 'View Retail Supplements & Merchandise', action: 'VIEW', risk: 'LOW' },
      { code: 'inventory:inventory-stock:manage', name: 'Perform Restock & Inventory Audits', action: 'UPDATE', risk: 'MEDIUM' },
      { code: 'inventory:equipment:view', name: 'Track Gym Equipment Assets & Warranties', action: 'VIEW', risk: 'LOW' },
      { code: 'inventory:maintenance:create', name: 'Dispatch Machine Repair Workorders', action: 'CREATE', risk: 'MEDIUM' },
    ],
  },
  crm: {
    key: 'crm',
    label: '💼 CRM, VIP Trials & Sales Pipeline',
    desc: 'Lead prospecting, day passes, member engagement campaigns, and tours',
    icon: 'Target',
    prefixes: ['crm:', 'leads:', 'visitors:', 'trials:', 'campaigns:', 'referrals:', 'tasks:'],
    capabilities: [
      { code: 'crm:leads:view', name: 'View Membership Sales Pipeline', action: 'VIEW', risk: 'LOW' },
      { code: 'crm:leads:create', name: 'Capture Walk-in Inquiries & Prospect Data', action: 'CREATE', risk: 'LOW' },
      { code: 'crm:visitors:manage', name: 'Authorize VIP Trial Guest Passes', action: 'UPDATE', risk: 'LOW' },
      { code: 'crm:campaigns:view', name: 'Inspect Retention & Referral Campaigns', action: 'VIEW', risk: 'LOW' },
    ],
  },
  analytics: {
    key: 'analytics',
    label: '📊 Business Intelligence & GAAP Reports',
    desc: 'MRR executive analytics, turnstile footfall metrics, and yield reports',
    icon: 'BarChart3',
    prefixes: ['analytics:', 'reports:', 'bi:'],
    capabilities: [
      { code: 'analytics:attendance:view', name: 'Inspect Turnstile Footfall Peak Yields', action: 'VIEW', risk: 'LOW' },
      { code: 'analytics:revenue:view', name: 'View Executive Recurring Revenue (MRR)', action: 'VIEW', risk: 'HIGH' },
      { code: 'analytics:trainer-analytics:view', name: 'Audit Coach Productivity & Bookings', action: 'VIEW', risk: 'MEDIUM' },
      { code: 'analytics:reports:export', name: 'Export Compliance & Financial Reports', action: 'EXPORT', risk: 'HIGH' },
    ],
  },
  admin: {
    key: 'admin',
    label: '⚙️ Administration & Security Governance',
    desc: 'IAM account provisioning, RBAC matrix, facility parameters, and audit logs',
    icon: 'Shield',
    prefixes: ['administration:', 'admin:', 'users:', 'roles:', 'permissions:', 'settings:', 'audit:'],
    capabilities: [
      { code: 'administration:users:view', name: 'View Administrative IAM Directory', action: 'VIEW', risk: 'HIGH' },
      { code: 'administration:users:create', name: 'Provision IAM Credentials & Passwords', action: 'CREATE', risk: 'CRITICAL' },
      { code: 'administration:roles:view', name: 'Inspect RBAC Roles & Clearances', action: 'VIEW', risk: 'HIGH' },
      { code: 'administration:permissions:view', name: 'Inspect Capability Definition Tokens', action: 'VIEW', risk: 'MEDIUM' },
      { code: 'administration:settings:manage', name: 'Modify Global Facility Brand Settings', action: 'UPDATE', risk: 'CRITICAL' },
      { code: 'administration:activity-logs:view', name: 'Access Cryptographic Audit Trail Logs', action: 'VIEW', risk: 'HIGH' },
    ],
  },
};

/**
 * Returns whether a specific high-level module is granted based on permissions list or role key.
 */
export const isModuleGranted = (moduleKey: string, permissionsList: string[] = [], roleKey?: string): boolean => {
  const normKey = (roleKey || '').toUpperCase();
  if (normKey === 'ADMIN' || normKey === 'SUPER_ADMIN' || normKey === 'GYM_OWNER') {
    return true;
  }
  if (!permissionsList || permissionsList.length === 0) {
    return false;
  }
  if (permissionsList.includes('*') || permissionsList.includes('all')) {
    return true;
  }
  if (permissionsList.includes(moduleKey)) {
    return true;
  }

  const def = AVAILABLE_MODULE_PERMISSIONS[moduleKey];
  if (!def) return false;

  return permissionsList.some((perm) =>
    def.prefixes.some((prefix) =>
      perm.toLowerCase().includes(prefix.toLowerCase()) ||
      perm.toLowerCase().startsWith(prefix.toLowerCase())
    )
  );
};

/**
 * Calculates the exact array of granted module keys for a role.
 */
export const getGrantedModules = (permissionsList: string[] = [], roleKey?: string): string[] => {
  const normKey = (roleKey || '').toUpperCase();
  if (normKey === 'ADMIN' || normKey === 'SUPER_ADMIN' || normKey === 'GYM_OWNER') {
    return Object.keys(AVAILABLE_MODULE_PERMISSIONS);
  }
  return Object.keys(AVAILABLE_MODULE_PERMISSIONS).filter((key) =>
    isModuleGranted(key, permissionsList, roleKey)
  );
};

/**
 * Gathers all active granular permissions for a given role based on granted modules.
 */
export const resolveEffectivePermissions = (grantedModuleKeys: string[], existingList: string[] = []): string[] => {
  const result = new Set<string>();

  if (grantedModuleKeys.length === Object.keys(AVAILABLE_MODULE_PERMISSIONS).length) {
    result.add('*');
  }

  for (const perm of existingList) {
    for (const modKey of grantedModuleKeys) {
      const def = AVAILABLE_MODULE_PERMISSIONS[modKey];
      if (def && def.prefixes.some((p) => perm.toLowerCase().includes(p.toLowerCase()))) {
        result.add(perm);
      }
    }
  }

  for (const modKey of grantedModuleKeys) {
    const def = AVAILABLE_MODULE_PERMISSIONS[modKey];
    if (def) {
      for (const cap of def.capabilities) {
        result.add(cap.code);
      }
    }
  }

  return Array.from(result);
};
