import { Router } from 'express';
import { BodyMeasurementsController } from '../controller/body-measurements.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createBodyMeasurementsSchema, updateBodyMeasurementsSchema } from '../validation/body-measurements.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { BODY_MEASUREMENTS_PERMISSIONS } from '../permissions/body-measurements.permissions.js';

const router = Router();
const controller = new BodyMeasurementsController();

router.get('/', requirePermission(BODY_MEASUREMENTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(BODY_MEASUREMENTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(BODY_MEASUREMENTS_PERMISSIONS.CREATE), validateRequest(createBodyMeasurementsSchema), controller.create);
router.put('/:id', requirePermission(BODY_MEASUREMENTS_PERMISSIONS.UPDATE), validateRequest(updateBodyMeasurementsSchema), controller.update);
router.delete('/:id', requirePermission(BODY_MEASUREMENTS_PERMISSIONS.DELETE), controller.remove);

export const bodyMeasurementsRoutes = router;
