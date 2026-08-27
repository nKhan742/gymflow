import { Router } from 'express';
import { MembershipRenewalsController } from '../controller/membership-renewals.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMembershipRenewalsSchema, updateMembershipRenewalsSchema } from '../validation/membership-renewals.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MEMBERSHIP_RENEWALS_PERMISSIONS } from '../permissions/membership-renewals.permissions.js';

const router = Router();
const controller = new MembershipRenewalsController();

router.get('/', requirePermission(MEMBERSHIP_RENEWALS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MEMBERSHIP_RENEWALS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MEMBERSHIP_RENEWALS_PERMISSIONS.CREATE), validateRequest(createMembershipRenewalsSchema), controller.create);
router.post('/:id/renew', controller.renew);
router.put('/:id', requirePermission(MEMBERSHIP_RENEWALS_PERMISSIONS.UPDATE), validateRequest(updateMembershipRenewalsSchema), controller.update);
router.delete('/:id', requirePermission(MEMBERSHIP_RENEWALS_PERMISSIONS.DELETE), controller.remove);

export const membershipRenewalsRoutes = router;
