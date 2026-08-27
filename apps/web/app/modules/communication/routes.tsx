import { RouteObject } from 'react-router-dom';
import { notificationsRoutes } from './notifications/routes';
import { announcementsRoutes } from './announcements/routes';
import { emailRoutes } from './email/routes';
import { smsRoutes } from './sms/routes';
import { whatsappRoutes } from './whatsapp/routes';

export const communicationRoutes: RouteObject[] = [
  ...notificationsRoutes,
  ...announcementsRoutes,
  ...emailRoutes,
  ...smsRoutes,
  ...whatsappRoutes,
];
