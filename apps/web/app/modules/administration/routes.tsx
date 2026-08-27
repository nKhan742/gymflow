import { RouteObject } from 'react-router-dom';
import { usersRoutes } from './users/routes';
import { rolesRoutes } from './roles/routes';
import { permissionsRoutes } from './permissions/routes';
import { activityLogsRoutes } from './activity-logs/routes';
import { auditLogsRoutes } from './audit-logs/routes';
import { settingsRoutes } from './settings/routes';
import { systemConfigurationRoutes } from './system-configuration/routes';

export const administrationRoutes: RouteObject[] = [
  ...usersRoutes,
  ...rolesRoutes,
  ...permissionsRoutes,
  ...activityLogsRoutes,
  ...auditLogsRoutes,
  ...settingsRoutes,
  ...systemConfigurationRoutes,
];
