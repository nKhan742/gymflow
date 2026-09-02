import React from 'react';
import { RouteObject } from 'react-router-dom';

const ListPage = React.lazy(() =>
  import('./pages/ListPage').then((m) => ({ default: m.ListPage }))
);

export const platformTenantsRoutes: RouteObject[] = [
  { path: '/administration/platform-tenants', element: <ListPage /> },
];
