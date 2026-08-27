import { Router } from 'express';
import { BmiController } from '../controller/bmi.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createBmiSchema, updateBmiSchema } from '../validation/bmi.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { BMI_PERMISSIONS } from '../permissions/bmi.permissions.js';

const router = Router();
const controller = new BmiController();

router.get('/', requirePermission(BMI_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(BMI_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(BMI_PERMISSIONS.CREATE), validateRequest(createBmiSchema), controller.create);
router.put('/:id', requirePermission(BMI_PERMISSIONS.UPDATE), validateRequest(updateBmiSchema), controller.update);
router.delete('/:id', requirePermission(BMI_PERMISSIONS.DELETE), controller.remove);

export const bmiRoutes = router;
