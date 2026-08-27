import { Router } from 'express';
import { StockAdjustmentController } from '../controller/stock-adjustment.controller.js';

export const stockAdjustmentRoutes = Router();
const controller = new StockAdjustmentController();

stockAdjustmentRoutes.get('/', controller.getAll);
stockAdjustmentRoutes.get('/:id', controller.getById);
stockAdjustmentRoutes.post('/', controller.create);
stockAdjustmentRoutes.put('/:id', controller.update);
stockAdjustmentRoutes.delete('/:id', controller.remove);
