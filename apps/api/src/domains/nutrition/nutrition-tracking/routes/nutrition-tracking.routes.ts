import { Router } from 'express';
import { NutritionTrackingController } from '../controller/nutrition-tracking.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createNutritionTrackingSchema, updateNutritionTrackingSchema } from '../validation/nutrition-tracking.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { NUTRITION_TRACKING_PERMISSIONS } from '../permissions/nutrition-tracking.permissions.js';

const router = Router();
const controller = new NutritionTrackingController();

router.get('/', requirePermission(NUTRITION_TRACKING_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(NUTRITION_TRACKING_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(NUTRITION_TRACKING_PERMISSIONS.CREATE), validateRequest(createNutritionTrackingSchema), controller.create);
router.put('/:id', requirePermission(NUTRITION_TRACKING_PERMISSIONS.UPDATE), validateRequest(updateNutritionTrackingSchema), controller.update);
router.delete('/:id', requirePermission(NUTRITION_TRACKING_PERMISSIONS.DELETE), controller.remove);

export const nutritionTrackingRoutes = router;
