import { Router } from 'express';
import { RevenueAnalyticsController } from '../controller/revenue-analytics.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createRevenueAnalyticsSchema, updateRevenueAnalyticsSchema } from '../validation/revenue-analytics.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { REVENUE_ANALYTICS_PERMISSIONS } from '../permissions/revenue-analytics.permissions.js';

const router = Router();
const controller = new RevenueAnalyticsController();

router.get('/', requirePermission(REVENUE_ANALYTICS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(REVENUE_ANALYTICS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(REVENUE_ANALYTICS_PERMISSIONS.CREATE), validateRequest(createRevenueAnalyticsSchema), controller.create);
router.put('/:id', requirePermission(REVENUE_ANALYTICS_PERMISSIONS.UPDATE), validateRequest(updateRevenueAnalyticsSchema), controller.update);
router.delete('/:id', requirePermission(REVENUE_ANALYTICS_PERMISSIONS.DELETE), controller.remove);

export const revenueAnalyticsRoutes = router;
