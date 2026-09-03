import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { adminDashboardRoutes } from './admin-dashboard/routes';
import { receptionDashboardRoutes } from './reception-dashboard/routes';
import { trainerDashboardRoutes } from './trainer-dashboard/routes';
import { nutritionDashboardRoutes } from './nutrition-dashboard/routes';
import { accountantDashboardRoutes } from './accountant-dashboard/routes';
import { memberDashboardRoutes } from './member-dashboard/routes';

import { useAuthStore } from '../../core/store/authStore';
import { getDefaultDashboardPath } from '../../core/guards/rbacGuard';

const DashboardRedirect: React.FC = () => {
  const { user } = useAuthStore();
  const target = getDefaultDashboardPath(user?.role);
  return <Navigate to={target} replace />;
};

export const dashboardRoutes: RouteObject[] = [
  { path: '/dashboard', element: <DashboardRedirect /> },
  ...adminDashboardRoutes,
  ...receptionDashboardRoutes,
  ...trainerDashboardRoutes,
  ...nutritionDashboardRoutes,
  ...accountantDashboardRoutes,
  ...memberDashboardRoutes,
];
