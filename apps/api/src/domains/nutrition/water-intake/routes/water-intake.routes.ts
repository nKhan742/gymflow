import { Router } from 'express';
import { WaterIntakeController } from '../controller/water-intake.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createWaterIntakeSchema, updateWaterIntakeSchema } from '../validation/water-intake.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { WATER_INTAKE_PERMISSIONS } from '../permissions/water-intake.permissions.js';

const router = Router();
const controller = new WaterIntakeController();

router.get('/', requirePermission(WATER_INTAKE_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(WATER_INTAKE_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(WATER_INTAKE_PERMISSIONS.CREATE), validateRequest(createWaterIntakeSchema), controller.create);
router.put('/:id', requirePermission(WATER_INTAKE_PERMISSIONS.UPDATE), validateRequest(updateWaterIntakeSchema), controller.update);
router.delete('/:id', requirePermission(WATER_INTAKE_PERMISSIONS.DELETE), controller.remove);

export const waterIntakeRoutes = router;
