import { Router } from 'express';
import { StaffController } from '../controller/staff.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createStaffSchema, updateStaffSchema } from '../validation/staff.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { STAFF_PERMISSIONS } from '../permissions/staff.permissions.js';

const router = Router();
const controller = new StaffController();

router.get('/', requirePermission(STAFF_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(STAFF_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(STAFF_PERMISSIONS.CREATE), validateRequest(createStaffSchema), controller.create);
router.put('/:id', requirePermission(STAFF_PERMISSIONS.UPDATE), validateRequest(updateStaffSchema), controller.update);
router.delete('/:id', requirePermission(STAFF_PERMISSIONS.DELETE), controller.remove);

export const staffRoutes = router;
