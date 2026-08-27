import { Router } from 'express';
import { DietPlansController } from '../controller/diet-plans.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createDietPlansSchema, updateDietPlansSchema } from '../validation/diet-plans.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { DIET_PLANS_PERMISSIONS } from '../permissions/diet-plans.permissions.js';

const router = Router();
const controller = new DietPlansController();

router.get('/', requirePermission(DIET_PLANS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(DIET_PLANS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(DIET_PLANS_PERMISSIONS.CREATE), validateRequest(createDietPlansSchema), controller.create);
router.put('/:id', requirePermission(DIET_PLANS_PERMISSIONS.UPDATE), validateRequest(updateDietPlansSchema), controller.update);
router.delete('/:id', requirePermission(DIET_PLANS_PERMISSIONS.DELETE), controller.remove);

export const dietPlansRoutes = router;
