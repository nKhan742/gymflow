import { RouteObject } from 'react-router-dom';
import { ListPage } from './pages/ListPage';

export const registerRoutes: RouteObject[] = [
  {
    path: 'register',
    element: <ListPage />,
  },
];

