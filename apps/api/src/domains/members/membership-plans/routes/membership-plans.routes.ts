import { Router } from 'express';
import { MembershipPlansController } from '../controller/membership-plans.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMembershipPlansSchema, updateMembershipPlansSchema } from '../validation/membership-plans.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MEMBERSHIP_PLANS_PERMISSIONS } from '../permissions/membership-plans.permissions.js';

const router = Router();
const controller = new MembershipPlansController();

router.get('/', requirePermission(MEMBERSHIP_PLANS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MEMBERSHIP_PLANS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MEMBERSHIP_PLANS_PERMISSIONS.CREATE), validateRequest(createMembershipPlansSchema), controller.create);
router.put('/:id', requirePermission(MEMBERSHIP_PLANS_PERMISSIONS.UPDATE), validateRequest(updateMembershipPlansSchema), controller.update);
router.delete('/:id', requirePermission(MEMBERSHIP_PLANS_PERMISSIONS.DELETE), controller.remove);

export const membershipPlansRoutes = router;
