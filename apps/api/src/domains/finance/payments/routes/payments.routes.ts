import { Router } from 'express';
import { PaymentsController } from '../controller/payments.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createPaymentsSchema, updatePaymentsSchema } from '../validation/payments.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { PAYMENTS_PERMISSIONS } from '../permissions/payments.permissions.js';

const router = Router();
const controller = new PaymentsController();

router.get('/', requirePermission(PAYMENTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(PAYMENTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(PAYMENTS_PERMISSIONS.CREATE), validateRequest(createPaymentsSchema), controller.create);
router.put('/:id', requirePermission(PAYMENTS_PERMISSIONS.UPDATE), validateRequest(updatePaymentsSchema), controller.update);
router.delete('/:id', requirePermission(PAYMENTS_PERMISSIONS.DELETE), controller.remove);

export const paymentsRoutes = router;
