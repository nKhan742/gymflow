import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/layouts/AppLayout';
import { AuthLayout } from '../shared/layouts/AuthLayout';
import { ProtectedRoute } from '../shared/components/protected-route/ProtectedRoute';
import { Loader2 } from 'lucide-react';

import { authRoutes } from '../modules/auth/routes';
import { dashboardRoutes } from '../modules/dashboard/routes';
import { administrationRoutes } from '../modules/administration/routes';
import { gymManagementRoutes } from '../modules/gym-management/routes';
import { memberManagementRoutes } from '../modules/member-management/routes';
import { fitnessRoutes } from '../modules/fitness/routes';
import { nutritionRoutes } from '../modules/nutrition/routes';
import { crmRoutes } from '../modules/crm/routes';
import { financeRoutes } from '../modules/finance/routes';
import { inventoryRoutes } from '../modules/inventory/routes';
import { equipmentRoutes } from '../modules/equipment/routes';
import { schedulingRoutes } from '../modules/scheduling/routes';
import { communicationRoutes } from '../modules/communication/routes';
import { reportsRoutes } from '../modules/reports/routes';
import { analyticsRoutes } from '../modules/analytics/routes';
import { profileRoutes } from '../modules/profile/routes';

const PlatformLoginPage = React.lazy(() =>
  import('../modules/auth/platform-login/PlatformLoginPage').then((m) => ({ default: m.PlatformLoginPage }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/platform-admin/login',
    element: <PlatformLoginPage />,
  },
  {
    path: '/platform-login',
    element: <Navigate to="/platform-admin/login" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      ...authRoutes,
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          ...dashboardRoutes,
          ...administrationRoutes,
          ...gymManagementRoutes,
          ...memberManagementRoutes,
          ...fitnessRoutes,
          ...nutritionRoutes,
          ...crmRoutes,
          ...financeRoutes,
          ...inventoryRoutes,
          ...equipmentRoutes,
          ...schedulingRoutes,
          ...communicationRoutes,
          ...reportsRoutes,
          ...analyticsRoutes,
          ...profileRoutes,
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background">
        <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          The requested enterprise route does not exist or you do not have permission to view it.
        </p>
      </div>
    ),
  },
]);

export const AppRouter: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-background text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};
