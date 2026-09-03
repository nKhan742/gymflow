import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { adminDashboardRoutes } from './admin-dashboard/routes';
import { receptionDashboardRoutes } from './reception-dashboard/routes';
import { trainerDashboardRoutes } from './trainer-dashboard/routes';
import { nutritionDashboardRoutes } from './nutrition-dashboard/routes';
import { accountantDashboardRoutes } from './accountant-dashboard/routes';
import { memberDashboardRoutes } from './member-dashboard/routes';

export const dashboardRoutes: RouteObject[] = [
  { path: '/dashboard', element: <Navigate to="/dashboard/admin-dashboard" replace /> },
  ...adminDashboardRoutes,
  ...receptionDashboardRoutes,
  ...trainerDashboardRoutes,
  ...nutritionDashboardRoutes,
  ...accountantDashboardRoutes,
  ...memberDashboardRoutes,
];
