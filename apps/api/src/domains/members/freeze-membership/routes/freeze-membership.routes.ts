import { Router } from 'express';
import { FreezeMembershipController } from '../controller/freeze-membership.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createFreezeMembershipSchema, updateFreezeMembershipSchema } from '../validation/freeze-membership.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { FREEZE_MEMBERSHIP_PERMISSIONS } from '../permissions/freeze-membership.permissions.js';

const router = Router();
const controller = new FreezeMembershipController();

router.get('/', requirePermission(FREEZE_MEMBERSHIP_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(FREEZE_MEMBERSHIP_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(FREEZE_MEMBERSHIP_PERMISSIONS.CREATE), validateRequest(createFreezeMembershipSchema), controller.create);
router.post('/:id/unfreeze', controller.unfreeze);
router.put('/:id', requirePermission(FREEZE_MEMBERSHIP_PERMISSIONS.UPDATE), validateRequest(updateFreezeMembershipSchema), controller.update);
router.delete('/:id', requirePermission(FREEZE_MEMBERSHIP_PERMISSIONS.DELETE), controller.remove);

export const freezeMembershipRoutes = router;
