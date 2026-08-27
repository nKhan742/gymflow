import { RouteObject } from 'react-router-dom';
import { equipmentListRoutes } from './equipment-list/routes';
import { maintenanceRoutes } from './maintenance/routes';
import { serviceHistoryRoutes } from './service-history/routes';

export const equipmentRoutes: RouteObject[] = [
  ...equipmentListRoutes,
  ...maintenanceRoutes,
  ...serviceHistoryRoutes,
];
