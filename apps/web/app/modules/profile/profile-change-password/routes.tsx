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

export const profileChangePasswordRoutes: RouteObject[] = [
  { path: '/profile/profile-change-password', element: <ListPage /> },
  { path: '/profile/profile-change-password/create', element: <CreatePage /> },
  { path: '/profile/profile-change-password/:id/edit', element: <EditPage /> },
  { path: '/profile/profile-change-password/:id', element: <ViewPage /> },
];
