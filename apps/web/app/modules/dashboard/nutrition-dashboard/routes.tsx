import React from 'react';
import { RouteObject } from 'react-router-dom';

const ListPage = React.lazy(() =>
  import('./pages/ListPage').then((m) => ({ default: m.ListPage }))
);
const CreatePage = React.lazy(() =>
  import('./pages/CreatePage').then((m) => ({ default: m.CreatePage }))
);
const EditPage = React.lazy(() =>
  import('./pages/EditPage').then((m) => ({ default: m.EditPage }))
);
const ViewPage = React.lazy(() =>
  import('./pages/ViewPage').then((m) => ({ default: m.ViewPage }))
);

export const nutritionDashboardRoutes: RouteObject[] = [
  { path: '/dashboard/nutrition-dashboard', element: <ListPage /> },
  { path: '/dashboard/nutrition-dashboard/create', element: <CreatePage /> },
  { path: '/dashboard/nutrition-dashboard/:id/edit', element: <EditPage /> },
  { path: '/dashboard/nutrition-dashboard/:id', element: <ViewPage /> },
];
