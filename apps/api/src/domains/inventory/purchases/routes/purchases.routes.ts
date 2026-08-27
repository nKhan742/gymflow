import { Router } from 'express';
import { PurchasesController } from '../controller/purchases.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createPurchasesSchema, updatePurchasesSchema } from '../validation/purchases.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { PURCHASES_PERMISSIONS } from '../permissions/purchases.permissions.js';

const router = Router();
const controller = new PurchasesController();

router.get('/', requirePermission(PURCHASES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(PURCHASES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(PURCHASES_PERMISSIONS.CREATE), validateRequest(createPurchasesSchema), controller.create);
router.put('/:id', requirePermission(PURCHASES_PERMISSIONS.UPDATE), validateRequest(updatePurchasesSchema), controller.update);
router.delete('/:id', requirePermission(PURCHASES_PERMISSIONS.DELETE), controller.remove);

export const purchasesRoutes = router;
