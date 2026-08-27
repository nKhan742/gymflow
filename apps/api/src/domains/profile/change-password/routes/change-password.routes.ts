import { Router } from 'express';
import { ChangePasswordController } from '../controller/change-password.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createChangePasswordSchema, updateChangePasswordSchema } from '../validation/change-password.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { CHANGE_PASSWORD_PERMISSIONS } from '../permissions/change-password.permissions.js';

const router = Router();
const controller = new ChangePasswordController();

router.get('/', requirePermission(CHANGE_PASSWORD_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(CHANGE_PASSWORD_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(CHANGE_PASSWORD_PERMISSIONS.CREATE), validateRequest(createChangePasswordSchema), controller.create);
router.put('/:id', requirePermission(CHANGE_PASSWORD_PERMISSIONS.UPDATE), validateRequest(updateChangePasswordSchema), controller.update);
router.delete('/:id', requirePermission(CHANGE_PASSWORD_PERMISSIONS.DELETE), controller.remove);

export const changePasswordRoutes = router;
