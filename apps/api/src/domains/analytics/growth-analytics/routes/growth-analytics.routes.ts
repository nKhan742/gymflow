import { Router } from 'express';
import { GrowthAnalyticsController } from '../controller/growth-analytics.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createGrowthAnalyticsSchema, updateGrowthAnalyticsSchema } from '../validation/growth-analytics.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { GROWTH_ANALYTICS_PERMISSIONS } from '../permissions/growth-analytics.permissions.js';

const router = Router();
const controller = new GrowthAnalyticsController();

router.get('/', requirePermission(GROWTH_ANALYTICS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(GROWTH_ANALYTICS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(GROWTH_ANALYTICS_PERMISSIONS.CREATE), validateRequest(createGrowthAnalyticsSchema), controller.create);
router.put('/:id', requirePermission(GROWTH_ANALYTICS_PERMISSIONS.UPDATE), validateRequest(updateGrowthAnalyticsSchema), controller.update);
router.delete('/:id', requirePermission(GROWTH_ANALYTICS_PERMISSIONS.DELETE), controller.remove);

export const growthAnalyticsRoutes = router;
