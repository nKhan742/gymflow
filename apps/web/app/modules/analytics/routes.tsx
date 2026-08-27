import { RouteObject } from 'react-router-dom';
import { dashboardAnalyticsRoutes } from './dashboard-analytics/routes';
import { revenueAnalyticsRoutes } from './revenue-analytics/routes';
import { attendanceAnalyticsRoutes } from './attendance-analytics/routes';
import { memberAnalyticsRoutes } from './member-analytics/routes';
import { trainerAnalyticsRoutes } from './trainer-analytics/routes';

export const analyticsRoutes: RouteObject[] = [
  ...dashboardAnalyticsRoutes,
  ...revenueAnalyticsRoutes,
  ...attendanceAnalyticsRoutes,
  ...memberAnalyticsRoutes,
  ...trainerAnalyticsRoutes,
];
