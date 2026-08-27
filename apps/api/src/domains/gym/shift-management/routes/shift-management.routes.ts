import { Router } from 'express';
import { ShiftManagementController } from '../controller/shift-management.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createShiftManagementSchema, updateShiftManagementSchema } from '../validation/shift-management.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { SHIFT_MANAGEMENT_PERMISSIONS } from '../permissions/shift-management.permissions.js';

const router = Router();
const controller = new ShiftManagementController();

router.get('/', requirePermission(SHIFT_MANAGEMENT_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(SHIFT_MANAGEMENT_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(SHIFT_MANAGEMENT_PERMISSIONS.CREATE), validateRequest(createShiftManagementSchema), controller.create);
router.put('/:id', requirePermission(SHIFT_MANAGEMENT_PERMISSIONS.UPDATE), validateRequest(updateShiftManagementSchema), controller.update);
router.delete('/:id', requirePermission(SHIFT_MANAGEMENT_PERMISSIONS.DELETE), controller.remove);

export const shiftManagementRoutes = router;
