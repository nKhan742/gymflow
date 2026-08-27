import { RouteObject } from 'react-router-dom';
import { myProfileRoutes } from './my-profile/routes';
import { profileChangePasswordRoutes } from './profile-change-password/routes';
import { profileNotificationsRoutes } from './profile-notifications/routes';
import { profilePreferencesRoutes } from './profile-preferences/routes';

export const profileRoutes: RouteObject[] = [
  ...myProfileRoutes,
  ...profileChangePasswordRoutes,
  ...profileNotificationsRoutes,
  ...profilePreferencesRoutes,
];
