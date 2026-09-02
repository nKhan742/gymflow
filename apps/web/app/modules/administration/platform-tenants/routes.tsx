import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PlatformAdminProtectedRoute } from '../../../shared/components/protected-route/PlatformAdminProtectedRoute';

const ListPage = React.lazy(() =>
  import('./pages/ListPage').then((m) => ({ default: m.ListPage }))
);

export const platformTenantsRoutes: RouteObject[] = [
  {
    path: '/administration/platform-tenants',
    element: (
      <PlatformAdminProtectedRoute>
        <ListPage />
      </PlatformAdminProtectedRoute>
    ),
  },
];
