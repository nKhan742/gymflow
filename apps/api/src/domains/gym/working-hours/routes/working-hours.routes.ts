import { Router } from 'express';
import { WorkingHoursController } from '../controller/working-hours.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createWorkingHoursSchema, updateWorkingHoursSchema } from '../validation/working-hours.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { WORKING_HOURS_PERMISSIONS } from '../permissions/working-hours.permissions.js';

const router = Router();
const controller = new WorkingHoursController();

router.get('/', requirePermission(WORKING_HOURS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(WORKING_HOURS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(WORKING_HOURS_PERMISSIONS.CREATE), validateRequest(createWorkingHoursSchema), controller.create);
router.put('/:id', requirePermission(WORKING_HOURS_PERMISSIONS.UPDATE), validateRequest(updateWorkingHoursSchema), controller.update);
router.delete('/:id', requirePermission(WORKING_HOURS_PERMISSIONS.DELETE), controller.remove);

export const workingHoursRoutes = router;
