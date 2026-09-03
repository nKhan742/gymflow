import { ISidebarMenuItem, SIDEBAR_MENU_CONFIG } from '../config/sidebarConfig';
import { isModuleGranted } from '../../modules/administration/roles/permissions.config';

/**
 * Maps top-level sidebar menu IDs to operational module keys.
 */
export const MENU_TO_MODULE_MAP: Record<string, string> = {
  administration: 'admin',
  'gym-management': 'gym_mgmt',
  'member-management': 'members',
  fitness: 'fitness',
  nutrition: 'nutrition',
  scheduling: 'scheduling',
  finance: 'finance',
  inventory: 'inventory',
  equipment: 'inventory',
  crm: 'crm',
  reports: 'analytics',
  analytics: 'analytics',
  communication: 'admin',
};

/**
 * Which roles are permitted to access each dashboard variant.
 */
export const DASHBOARD_ROLE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard/admin-dashboard': ['ADMIN', 'SUPER_ADMIN', 'BRANCH_MANAGER'],
  '/dashboard/trainer-dashboard': ['TRAINER', 'ADMIN', 'SUPER_ADMIN'],
  '/dashboard/reception-dashboard': ['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'],
  '/dashboard/nutrition-dashboard': ['NUTRITIONIST', 'ADMIN', 'SUPER_ADMIN'],
  '/dashboard/accountant-dashboard': ['ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN'],
  '/dashboard/member-dashboard': ['MEMBER', 'ADMIN', 'SUPER_ADMIN'],
};

/**
 * Subpaths explicitly restricted for specific operational roles.
 */
export const ROLE_DISALLOWED_SUBPATHS: Record<string, string[]> = {
  TRAINER: [
    '/member-management/freeze-membership',
    '/member-management/membership-renewals',
    '/member-management/membership-plans',
  ],
  RECEPTIONIST: [
    '/gym-management/gym-profile',
    '/gym-management/branches',
    '/gym-management/departments',
    '/gym-management/staff',
  ],
  NUTRITIONIST: [
    '/fitness/pt',
    '/fitness/exercise-library',
  ],
  ACCOUNTANT: [
    '/member-management/bmi',
    '/member-management/body-measurements',
    '/member-management/medical-history',
    '/inventory/equipment',
  ],
  MEMBER: [
    '/member-management/members',
    '/member-management/staff',
    '/member-management/departments',
  ],
};

/**
 * Returns the default home dashboard route corresponding to a user's role.
 */
export const getDefaultDashboardPath = (role?: string): string => {
  const norm = (role || '').toUpperCase();
  switch (norm) {
    case 'TRAINER':
      return '/dashboard/trainer-dashboard';
    case 'RECEPTIONIST':
      return '/dashboard/reception-dashboard';
    case 'NUTRITIONIST':
      return '/dashboard/nutrition-dashboard';
    case 'ACCOUNTANT':
      return '/dashboard/accountant-dashboard';
    case 'MEMBER':
      return '/dashboard/member-dashboard';
    case 'BRANCH_MANAGER':
    case 'ADMIN':
    case 'SUPER_ADMIN':
    default:
      return '/dashboard/admin-dashboard';
  }
};

/**
 * Validates whether a user with a given role and permissions is authorized to access a top-level module menu.
 */
/**
 * Validates whether a user with a given role and permissions is authorized to access a top-level module menu.
 */
export const canAccessModule = (
  menuId: string,
  role?: string,
  permissions: string[] = []
): boolean => {
  const normRole = (role || '').toUpperCase();
  if (normRole === 'ADMIN' || normRole === 'SUPER_ADMIN') {
    return true;
  }

  // Profile and Dashboard are always open for all authenticated users
  if (menuId === 'profile' || menuId === 'dashboard') {
    return true;
  }

  // Administration domain
  if (menuId === 'administration') {
    if (normRole === 'ADMIN' || normRole === 'SUPER_ADMIN') return true;
    return isModuleGranted('admin', permissions, role);
  }

  // Check wildcards
  if (permissions.includes('*') || permissions.includes('all')) {
    return true;
  }

  // Direct module match or wildcard
  if (permissions.includes(menuId) || permissions.includes(`${menuId}:*`)) {
    return true;
  }

  const moduleKey = MENU_TO_MODULE_MAP[menuId] || menuId;
  if (permissions.includes(moduleKey) || permissions.includes(`${moduleKey}:*`)) {
    return true;
  }

  return isModuleGranted(moduleKey, permissions, role);
};

/**
 * Validates whether a specific URL pathname is accessible by the user.
 */
export const canAccessPath = (
  pathname: string,
  role?: string,
  permissions: string[] = []
): boolean => {
  const normRole = (role || '').toUpperCase();
  if (normRole === 'ADMIN' || normRole === 'SUPER_ADMIN') {
    return true;
  }

  // Check dashboard access
  for (const [dashPath, allowedRoles] of Object.entries(DASHBOARD_ROLE_PERMISSIONS)) {
    if (pathname === dashPath || pathname.startsWith(dashPath + '/')) {
      return allowedRoles.includes(normRole);
    }
  }

  // Check top-level domain access
  const segments = pathname.split('/').filter(Boolean);
  const rootSegment = segments[0] || '';

  if (rootSegment === 'profile' || rootSegment === 'dashboard') return true;

  // Allow authenticated users to view specific invoice receipts (e.g. trainer checking generated client invoice)
  if (pathname.startsWith('/finance/invoices/')) return true;

  return canAccessModule(rootSegment, role, permissions);
};

/**
 * Filters the sidebar navigation tree based on user RBAC permissions and subscription access.
 */
export const filterSidebarMenuForUser = (
  menuItems: ISidebarMenuItem[],
  role?: string,
  permissions: string[] = [],
  isSuperAdmin: boolean = false
): ISidebarMenuItem[] => {
  const normRole = (role || '').toUpperCase();

  return menuItems
    .filter((menu) => {
      if (menu.id === 'auth') return false;
      return canAccessModule(menu.id, role, permissions);
    })
    .map((menu) => {
      if (!menu.children || menu.children.length === 0) {
        return menu;
      }

      const isModuleOpen = canAccessModule(menu.id, role, permissions);

      const filteredChildren = menu.children.filter((sub) => {
        // Superadmin only items
        if (sub.superAdminOnly && !isSuperAdmin) {
          return false;
        }

        // For dashboard items, enforce role dashboard mapping
        if (DASHBOARD_ROLE_PERMISSIONS[sub.path]) {
          const allowedRoles = DASHBOARD_ROLE_PERMISSIONS[sub.path];
          if (!allowedRoles.includes(normRole)) {
            return false;
          }
        }

        // If the top-level module is granted to the user, ALL operational children in that module are accessible
        if (isModuleOpen && menu.id !== 'administration') {
          return true;
        }

        // For administration sub-items, check specific permission if not full admin
        if (menu.id === 'administration' && normRole !== 'ADMIN' && normRole !== 'SUPER_ADMIN') {
          if (sub.permission) {
            const hasWildcard = permissions.includes('*') || permissions.includes('all');
            const hasExact = permissions.includes(sub.permission);
            const hasPrefix = permissions.some((p) =>
              sub.permission && (p.startsWith(sub.permission.split(':')[0]) || sub.permission.startsWith(p))
            );
            if (!hasWildcard && !hasExact && !hasPrefix) {
              return false;
            }
          }
        }

        return true;
      });

      return {
        ...menu,
        children: filteredChildren,
      };
    })
    .filter((menu) => {
      // Keep menus with children, or root action menus like Profile/Dashboard
      if (menu.children && menu.children.length === 0 && menu.id !== 'profile' && menu.id !== 'dashboard') {
        return false;
      }
      return true;
    });
};
