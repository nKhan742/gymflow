import { ISidebarMenuItem } from '../config/sidebarConfig';
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
export const canAccessModule = (
  menuId: string,
  role?: string,
  permissions: string[] = []
): boolean => {
  const normRole = (role || '').toUpperCase();
  if (normRole === 'ADMIN' || normRole === 'SUPER_ADMIN') {
    return true;
  }

  // Profile is always open for all authenticated users
  if (menuId === 'profile' || menuId === 'dashboard') {
    return true;
  }

  // Administration domain is strictly reserved for Admin & Super Admin
  if (menuId === 'administration') {
    return normRole === 'ADMIN' || normRole === 'SUPER_ADMIN';
  }

  const moduleKey = MENU_TO_MODULE_MAP[menuId];
  if (!moduleKey) {
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

  // Check disallowed subpaths for role
  const disallowed = ROLE_DISALLOWED_SUBPATHS[normRole] || [];
  if (disallowed.some((badPath) => pathname === badPath || pathname.startsWith(badPath + '/'))) {
    return false;
  }

  // Check top-level domain access
  const segments = pathname.split('/').filter(Boolean);
  const rootSegment = segments[0] || '';

  if (rootSegment === 'profile') return true;
  if (rootSegment === 'dashboard') return true;

  if (rootSegment === 'administration') {
    return normRole === 'ADMIN' || normRole === 'SUPER_ADMIN';
  }

  const moduleKey = MENU_TO_MODULE_MAP[rootSegment];
  if (moduleKey) {
    return isModuleGranted(moduleKey, permissions, role);
  }

  return true;
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

        // Check disallowed subpaths
        const disallowed = ROLE_DISALLOWED_SUBPATHS[normRole] || [];
        if (disallowed.some((bad) => sub.path === bad || sub.path.startsWith(bad + '/'))) {
          return false;
        }

        return true;
      });

      return {
        ...menu,
        children: filteredChildren,
      };
    })
    .filter((menu) => {
      // If a group has children defined originally but all were filtered out, hide the group
      if (menu.children && menu.children.length === 0 && menu.id !== 'profile') {
        return false;
      }
      return true;
    });
};
