import { Router } from 'express';
import { adminDashboardRoutes } from './admin-dashboard/routes.js';

export const dashboardDomainRoutes = Router();

dashboardDomainRoutes.use('/admin-dashboard', adminDashboardRoutes);

