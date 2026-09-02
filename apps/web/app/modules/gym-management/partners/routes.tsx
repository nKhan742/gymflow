import { RouteObject } from 'react-router-dom';
import { ListPage } from './pages/ListPage';

export const partnersRoutes: RouteObject[] = [
  {
    path: 'partners',
    element: <ListPage />,
  },
];
