import { Router } from 'express';
import { MyProfileController } from '../controller/my-profile.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMyProfileSchema, updateMyProfileSchema } from '../validation/my-profile.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MY_PROFILE_PERMISSIONS } from '../permissions/my-profile.permissions.js';

const router = Router();
const controller = new MyProfileController();

router.get('/', requirePermission(MY_PROFILE_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MY_PROFILE_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MY_PROFILE_PERMISSIONS.CREATE), validateRequest(createMyProfileSchema), controller.create);
router.put('/:id', requirePermission(MY_PROFILE_PERMISSIONS.UPDATE), validateRequest(updateMyProfileSchema), controller.update);
router.delete('/:id', requirePermission(MY_PROFILE_PERMISSIONS.DELETE), controller.remove);

export const myProfileRoutes = router;
