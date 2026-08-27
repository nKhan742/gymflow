import { RouteObject } from 'react-router-dom';
import { adminDashboardRoutes } from './admin-dashboard/routes';
import { receptionDashboardRoutes } from './reception-dashboard/routes';
import { trainerDashboardRoutes } from './trainer-dashboard/routes';
import { nutritionDashboardRoutes } from './nutrition-dashboard/routes';
import { accountantDashboardRoutes } from './accountant-dashboard/routes';
import { memberDashboardRoutes } from './member-dashboard/routes';

export const dashboardRoutes: RouteObject[] = [
  ...adminDashboardRoutes,
  ...receptionDashboardRoutes,
  ...trainerDashboardRoutes,
  ...nutritionDashboardRoutes,
  ...accountantDashboardRoutes,
  ...memberDashboardRoutes,
];
