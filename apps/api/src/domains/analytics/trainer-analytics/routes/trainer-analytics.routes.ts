import { Router } from 'express';
import { TrainerAnalyticsController } from '../controller/trainer-analytics.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTrainerAnalyticsSchema, updateTrainerAnalyticsSchema } from '../validation/trainer-analytics.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TRAINER_ANALYTICS_PERMISSIONS } from '../permissions/trainer-analytics.permissions.js';

const router = Router();
const controller = new TrainerAnalyticsController();

router.get('/', requirePermission(TRAINER_ANALYTICS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TRAINER_ANALYTICS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TRAINER_ANALYTICS_PERMISSIONS.CREATE), validateRequest(createTrainerAnalyticsSchema), controller.create);
router.put('/:id', requirePermission(TRAINER_ANALYTICS_PERMISSIONS.UPDATE), validateRequest(updateTrainerAnalyticsSchema), controller.update);
router.delete('/:id', requirePermission(TRAINER_ANALYTICS_PERMISSIONS.DELETE), controller.remove);

export const trainerAnalyticsRoutes = router;
