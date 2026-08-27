import { Router } from 'express';
import { PermissionsController } from '../controller/permissions.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createPermissionsSchema, updatePermissionsSchema } from '../validation/permissions.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { PERMISSIONS_PERMISSIONS } from '../permissions/permissions.permissions.js';

const router = Router();
const controller = new PermissionsController();

router.get('/', requirePermission(PERMISSIONS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(PERMISSIONS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(PERMISSIONS_PERMISSIONS.CREATE), validateRequest(createPermissionsSchema), controller.create);
router.put('/:id', requirePermission(PERMISSIONS_PERMISSIONS.UPDATE), validateRequest(updatePermissionsSchema), controller.update);
router.delete('/:id', requirePermission(PERMISSIONS_PERMISSIONS.DELETE), controller.remove);

export const permissionsRoutes = router;
