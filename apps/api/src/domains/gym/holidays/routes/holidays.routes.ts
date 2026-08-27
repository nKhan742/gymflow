import { Router } from 'express';
import { HolidaysController } from '../controller/holidays.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createHolidaysSchema, updateHolidaysSchema } from '../validation/holidays.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { HOLIDAYS_PERMISSIONS } from '../permissions/holidays.permissions.js';

const router = Router();
const controller = new HolidaysController();

router.get('/', requirePermission(HOLIDAYS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(HOLIDAYS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(HOLIDAYS_PERMISSIONS.CREATE), validateRequest(createHolidaysSchema), controller.create);
router.put('/:id', requirePermission(HOLIDAYS_PERMISSIONS.UPDATE), validateRequest(updateHolidaysSchema), controller.update);
router.delete('/:id', requirePermission(HOLIDAYS_PERMISSIONS.DELETE), controller.remove);

export const holidaysRoutes = router;
