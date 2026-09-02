import { Router } from 'express';
import { PlatformController } from './controllers/platform.controller.js';

export const platformDomainRoutes = Router();

platformDomainRoutes.get('/tenants', PlatformController.getTenants);
platformDomainRoutes.patch('/tenants/:dbName/status', PlatformController.updateStatus);
platformDomainRoutes.get('/notifications', PlatformController.getNotifications);
platformDomainRoutes.post('/notifications/read-all', PlatformController.markNotificationsRead);
