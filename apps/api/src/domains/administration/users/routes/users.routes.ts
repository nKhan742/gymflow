import { Router } from 'express';
import { UsersController } from '../controller/users.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createUsersSchema, updateUsersSchema } from '../validation/users.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { USERS_PERMISSIONS } from '../permissions/users.permissions.js';

const router = Router();
const controller = new UsersController();

router.get('/', requirePermission(USERS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(USERS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(USERS_PERMISSIONS.CREATE), validateRequest(createUsersSchema), controller.create);
router.put('/:id', requirePermission(USERS_PERMISSIONS.UPDATE), validateRequest(updateUsersSchema), controller.update);
router.delete('/:id', requirePermission(USERS_PERMISSIONS.DELETE), controller.remove);

export const usersRoutes = router;
