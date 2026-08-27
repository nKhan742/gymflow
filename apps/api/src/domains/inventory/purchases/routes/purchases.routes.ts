import { Router } from 'express';
import { PurchasesController } from '../controller/purchases.controller.js';

export const purchasesRoutes = Router();
const controller = new PurchasesController();

purchasesRoutes.get('/', controller.getAll);
purchasesRoutes.get('/:id', controller.getById);
purchasesRoutes.post('/', controller.create);
purchasesRoutes.put('/:id', controller.update);
purchasesRoutes.delete('/:id', controller.remove);
