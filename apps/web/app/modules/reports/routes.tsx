import { RouteObject } from 'react-router-dom';
import { revenueReportsRoutes } from './revenue-reports/routes';
import { attendanceReportsRoutes } from './attendance-reports/routes';
import { membershipReportsRoutes } from './membership-reports/routes';
import { trainerReportsRoutes } from './trainer-reports/routes';
import { inventoryReportsRoutes } from './inventory-reports/routes';
import { financeReportsRoutes } from './finance-reports/routes';

export const reportsRoutes: RouteObject[] = [
  ...revenueReportsRoutes,
  ...attendanceReportsRoutes,
  ...membershipReportsRoutes,
  ...trainerReportsRoutes,
  ...inventoryReportsRoutes,
  ...financeReportsRoutes,
];
