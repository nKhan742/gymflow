import { Router } from 'express';
import { CouponsController } from '../controller/coupons.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createCouponsSchema, updateCouponsSchema } from '../validation/coupons.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { COUPONS_PERMISSIONS } from '../permissions/coupons.permissions.js';

const router = Router();
const controller = new CouponsController();

router.get('/', requirePermission(COUPONS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(COUPONS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(COUPONS_PERMISSIONS.CREATE), validateRequest(createCouponsSchema), controller.create);
router.put('/:id', requirePermission(COUPONS_PERMISSIONS.UPDATE), validateRequest(updateCouponsSchema), controller.update);
router.delete('/:id', requirePermission(COUPONS_PERMISSIONS.DELETE), controller.remove);

export const couponsRoutes = router;
