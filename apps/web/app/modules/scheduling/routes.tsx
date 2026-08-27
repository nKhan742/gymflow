import { RouteObject } from 'react-router-dom';
import { calendarRoutes } from './calendar/routes';
import { trainerScheduleRoutes } from './trainer-schedule/routes';
import { appointmentsRoutes } from './appointments/routes';
import { resourceBookingRoutes } from './resource-booking/routes';

export const schedulingRoutes: RouteObject[] = [
  ...calendarRoutes,
  ...trainerScheduleRoutes,
  ...appointmentsRoutes,
  ...resourceBookingRoutes,
];
