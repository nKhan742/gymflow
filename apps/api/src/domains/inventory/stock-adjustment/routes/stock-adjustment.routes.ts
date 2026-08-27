import { Router } from 'express';
import { StockAdjustmentController } from '../controller/stock-adjustment.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createStockAdjustmentSchema, updateStockAdjustmentSchema } from '../validation/stock-adjustment.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { STOCK_ADJUSTMENT_PERMISSIONS } from '../permissions/stock-adjustment.permissions.js';

const router = Router();
const controller = new StockAdjustmentController();

router.get('/', requirePermission(STOCK_ADJUSTMENT_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(STOCK_ADJUSTMENT_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(STOCK_ADJUSTMENT_PERMISSIONS.CREATE), validateRequest(createStockAdjustmentSchema), controller.create);
router.put('/:id', requirePermission(STOCK_ADJUSTMENT_PERMISSIONS.UPDATE), validateRequest(updateStockAdjustmentSchema), controller.update);
router.delete('/:id', requirePermission(STOCK_ADJUSTMENT_PERMISSIONS.DELETE), controller.remove);

export const stockAdjustmentRoutes = router;
