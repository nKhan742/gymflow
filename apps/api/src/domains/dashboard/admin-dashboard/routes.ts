import { Router } from 'express';
import { DashboardController } from './controllers/dashboard.controller.js';
import { authMiddleware } from '../../../core/middleware/auth.middleware.js';

export const adminDashboardRoutes = Router();
const controller = new DashboardController();

adminDashboardRoutes.get('/stats', authMiddleware, controller.getStats);
adminDashboardRoutes.get('/revenue-analytics', authMiddleware, controller.getRevenueAnalytics);
adminDashboardRoutes.get('/hourly-attendance', authMiddleware, controller.getHourlyAttendance);
