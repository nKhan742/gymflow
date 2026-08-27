import { RouteObject } from 'react-router-dom';
import { gymProfileRoutes } from './gym-profile/routes';
import { branchesRoutes } from './branches/routes';
import { departmentsRoutes } from './departments/routes';
import { staffRoutes } from './staff/routes';
import { shiftManagementRoutes } from './shift-management/routes';
import { holidaysRoutes } from './holidays/routes';
import { workingHoursRoutes } from './working-hours/routes';

export const gymManagementRoutes: RouteObject[] = [
  ...gymProfileRoutes,
  ...branchesRoutes,
  ...departmentsRoutes,
  ...staffRoutes,
  ...shiftManagementRoutes,
  ...holidaysRoutes,
  ...workingHoursRoutes,
];
