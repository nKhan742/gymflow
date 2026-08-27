import { Router } from 'express';
import { DashboardController } from './controllers/dashboard.controller.js';

export const adminDashboardRoutes = Router();
const controller = new DashboardController();

adminDashboardRoutes.get('/stats', controller.getStats);
adminDashboardRoutes.get('/revenue-analytics', controller.getRevenueAnalytics);
adminDashboardRoutes.get('/hourly-attendance', controller.getHourlyAttendance);

