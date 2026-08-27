import { Router } from 'express';
import { InventoryController } from '../controller/inventory.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createInventorySchema, updateInventorySchema } from '../validation/inventory.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { INVENTORY_PERMISSIONS } from '../permissions/inventory.permissions.js';

const router = Router();
const controller = new InventoryController();

router.get('/', requirePermission(INVENTORY_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(INVENTORY_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(INVENTORY_PERMISSIONS.CREATE), validateRequest(createInventorySchema), controller.create);
router.put('/:id', requirePermission(INVENTORY_PERMISSIONS.UPDATE), validateRequest(updateInventorySchema), controller.update);
router.delete('/:id', requirePermission(INVENTORY_PERMISSIONS.DELETE), controller.remove);

export const inventoryRoutes = router;
