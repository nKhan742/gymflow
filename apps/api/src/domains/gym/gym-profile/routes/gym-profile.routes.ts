import { Router } from 'express';
import { GymProfileController } from '../controller/gym-profile.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createGymProfileSchema, updateGymProfileSchema } from '../validation/gym-profile.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { GYM_PROFILE_PERMISSIONS } from '../permissions/gym-profile.permissions.js';

const router = Router();
const controller = new GymProfileController();

router.get('/', requirePermission(GYM_PROFILE_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(GYM_PROFILE_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(GYM_PROFILE_PERMISSIONS.CREATE), validateRequest(createGymProfileSchema), controller.create);
router.put('/:id', requirePermission(GYM_PROFILE_PERMISSIONS.UPDATE), validateRequest(updateGymProfileSchema), controller.update);
router.delete('/:id', requirePermission(GYM_PROFILE_PERMISSIONS.DELETE), controller.remove);

export const gymProfileRoutes = router;
