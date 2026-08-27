import { Router } from 'express';
import { revenueReportsRoutes } from './revenue-reports/routes/index.js';
import { attendanceReportsRoutes } from './attendance-reports/routes/index.js';
import { memberReportsRoutes } from './member-reports/routes/index.js';
import { trainerReportsRoutes } from './trainer-reports/routes/index.js';
import { inventoryReportsRoutes } from './inventory-reports/routes/index.js';
import { financeReportsRoutes } from './finance-reports/routes/index.js';

const router = Router();

router.use('/revenue-reports', revenueReportsRoutes);
router.use('/attendance-reports', attendanceReportsRoutes);
router.use('/member-reports', memberReportsRoutes);
router.use('/trainer-reports', trainerReportsRoutes);
router.use('/inventory-reports', inventoryReportsRoutes);
router.use('/finance-reports', financeReportsRoutes);

export const reportsDomainRoutes = router;
