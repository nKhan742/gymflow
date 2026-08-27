import { Router } from 'express';
import { FollowUpsController } from '../controller/follow-ups.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createFollowUpsSchema, updateFollowUpsSchema } from '../validation/follow-ups.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { FOLLOW_UPS_PERMISSIONS } from '../permissions/follow-ups.permissions.js';

const router = Router();
const controller = new FollowUpsController();

router.get('/', requirePermission(FOLLOW_UPS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(FOLLOW_UPS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(FOLLOW_UPS_PERMISSIONS.CREATE), validateRequest(createFollowUpsSchema), controller.create);
router.put('/:id', requirePermission(FOLLOW_UPS_PERMISSIONS.UPDATE), validateRequest(updateFollowUpsSchema), controller.update);
router.delete('/:id', requirePermission(FOLLOW_UPS_PERMISSIONS.DELETE), controller.remove);

export const followUpsRoutes = router;
