import { RouteObject } from 'react-router-dom';
import { ListPage } from './pages/ListPage';

export const floorsZonesRoutes: RouteObject[] = [
  {
    path: 'floors-zones',
    element: <ListPage />,
  },
];
