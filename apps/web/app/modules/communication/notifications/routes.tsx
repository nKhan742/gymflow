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

export const notificationsRoutes: RouteObject[] = [
  { path: '/communication/notifications', element: <ListPage /> },
  { path: '/communication/notifications/create', element: <CreatePage /> },
  { path: '/communication/notifications/:id/edit', element: <EditPage /> },
  { path: '/communication/notifications/:id', element: <ViewPage /> },
];
