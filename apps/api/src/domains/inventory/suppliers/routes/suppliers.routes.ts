import { Router } from 'express';
import { SuppliersController } from '../controller/suppliers.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createSuppliersSchema, updateSuppliersSchema } from '../validation/suppliers.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { SUPPLIERS_PERMISSIONS } from '../permissions/suppliers.permissions.js';

const router = Router();
const controller = new SuppliersController();

router.get('/', requirePermission(SUPPLIERS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(SUPPLIERS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(SUPPLIERS_PERMISSIONS.CREATE), validateRequest(createSuppliersSchema), controller.create);
router.put('/:id', requirePermission(SUPPLIERS_PERMISSIONS.UPDATE), validateRequest(updateSuppliersSchema), controller.update);
router.delete('/:id', requirePermission(SUPPLIERS_PERMISSIONS.DELETE), controller.remove);

export const suppliersRoutes = router;
