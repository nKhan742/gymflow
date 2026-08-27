import { Router } from 'express';
import { GroupClassesController } from '../controller/group-classes.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createGroupClassesSchema, updateGroupClassesSchema } from '../validation/group-classes.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { GROUP_CLASSES_PERMISSIONS } from '../permissions/group-classes.permissions.js';

const router = Router();
const controller = new GroupClassesController();

router.get('/', requirePermission(GROUP_CLASSES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(GROUP_CLASSES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(GROUP_CLASSES_PERMISSIONS.CREATE), validateRequest(createGroupClassesSchema), controller.create);
router.put('/:id', requirePermission(GROUP_CLASSES_PERMISSIONS.UPDATE), validateRequest(updateGroupClassesSchema), controller.update);
router.delete('/:id', requirePermission(GROUP_CLASSES_PERMISSIONS.DELETE), controller.remove);

export const groupClassesRoutes = router;
