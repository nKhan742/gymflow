import { RouteObject } from 'react-router-dom';
import { ListPage } from './pages/ListPage';

export const accessControlRoutes: RouteObject[] = [
  {
    path: 'access-control',
    element: <ListPage />,
  },
];
