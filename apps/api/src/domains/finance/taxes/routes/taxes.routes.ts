import { Router } from 'express';
import { TaxesController } from '../controller/taxes.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTaxesSchema, updateTaxesSchema } from '../validation/taxes.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TAXES_PERMISSIONS } from '../permissions/taxes.permissions.js';

const router = Router();
const controller = new TaxesController();

router.get('/', requirePermission(TAXES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TAXES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TAXES_PERMISSIONS.CREATE), validateRequest(createTaxesSchema), controller.create);
router.put('/:id', requirePermission(TAXES_PERMISSIONS.UPDATE), validateRequest(updateTaxesSchema), controller.update);
router.delete('/:id', requirePermission(TAXES_PERMISSIONS.DELETE), controller.remove);

export const taxesRoutes = router;
