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

export const inventoryStockRoutes: RouteObject[] = [
  { path: '/inventory/inventory-stock', element: <ListPage /> },
  { path: '/inventory/inventory-stock/create', element: <CreatePage /> },
  { path: '/inventory/inventory-stock/:id/edit', element: <EditPage /> },
  { path: '/inventory/inventory-stock/:id', element: <ViewPage /> },
];
