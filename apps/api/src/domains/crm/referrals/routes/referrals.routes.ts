import { Router } from 'express';
import { ReferralsController } from '../controller/referrals.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createReferralsSchema, updateReferralsSchema } from '../validation/referrals.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { REFERRALS_PERMISSIONS } from '../permissions/referrals.permissions.js';

const router = Router();
const controller = new ReferralsController();

router.get('/', requirePermission(REFERRALS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(REFERRALS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(REFERRALS_PERMISSIONS.CREATE), validateRequest(createReferralsSchema), controller.create);
router.put('/:id', requirePermission(REFERRALS_PERMISSIONS.UPDATE), validateRequest(updateReferralsSchema), controller.update);
router.delete('/:id', requirePermission(REFERRALS_PERMISSIONS.DELETE), controller.remove);

export const referralsRoutes = router;
