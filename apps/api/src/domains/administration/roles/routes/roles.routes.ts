import { Router } from 'express';
import { RolesController } from '../controller/roles.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createRolesSchema, updateRolesSchema } from '../validation/roles.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { ROLES_PERMISSIONS } from '../permissions/roles.permissions.js';

const router = Router();
const controller = new RolesController();

router.get('/', requirePermission(ROLES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(ROLES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(ROLES_PERMISSIONS.CREATE), validateRequest(createRolesSchema), controller.create);
router.put('/:id', requirePermission(ROLES_PERMISSIONS.UPDATE), validateRequest(updateRolesSchema), controller.update);
router.delete('/:id', requirePermission(ROLES_PERMISSIONS.DELETE), controller.remove);

export const rolesRoutes = router;
