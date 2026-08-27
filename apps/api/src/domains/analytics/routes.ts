import { Router } from 'express';
import { revenueAnalyticsRoutes } from './revenue-analytics/routes/index.js';
import { attendanceAnalyticsRoutes } from './attendance-analytics/routes/index.js';
import { growthAnalyticsRoutes } from './growth-analytics/routes/index.js';
import { trainerAnalyticsRoutes } from './trainer-analytics/routes/index.js';
import { memberAnalyticsRoutes } from './member-analytics/routes/index.js';

const router = Router();

router.use('/revenue-analytics', revenueAnalyticsRoutes);
router.use('/attendance-analytics', attendanceAnalyticsRoutes);
router.use('/growth-analytics', growthAnalyticsRoutes);
router.use('/trainer-analytics', trainerAnalyticsRoutes);
router.use('/member-analytics', memberAnalyticsRoutes);

export const analyticsDomainRoutes = router;
