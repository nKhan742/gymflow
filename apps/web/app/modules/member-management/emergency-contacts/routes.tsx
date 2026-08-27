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

export const emergencyContactsRoutes: RouteObject[] = [
  { path: '/member-management/emergency-contacts', element: <ListPage /> },
  { path: '/member-management/emergency-contacts/create', element: <CreatePage /> },
  { path: '/member-management/emergency-contacts/:id/edit', element: <EditPage /> },
  { path: '/member-management/emergency-contacts/:id', element: <ViewPage /> },
];
