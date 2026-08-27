import { Router } from 'express';
import { InventoryReportsController } from '../controller/inventory-reports.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createInventoryReportsSchema, updateInventoryReportsSchema } from '../validation/inventory-reports.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { INVENTORY_REPORTS_PERMISSIONS } from '../permissions/inventory-reports.permissions.js';

const router = Router();
const controller = new InventoryReportsController();

router.get('/', requirePermission(INVENTORY_REPORTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(INVENTORY_REPORTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(INVENTORY_REPORTS_PERMISSIONS.CREATE), validateRequest(createInventoryReportsSchema), controller.create);
router.put('/:id', requirePermission(INVENTORY_REPORTS_PERMISSIONS.UPDATE), validateRequest(updateInventoryReportsSchema), controller.update);
router.delete('/:id', requirePermission(INVENTORY_REPORTS_PERMISSIONS.DELETE), controller.remove);

export const inventoryReportsRoutes = router;
