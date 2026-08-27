import { Router } from 'express';
import { InventoryController } from '../controller/inventory.controller.js';

export const inventoryRoutes = Router();
const controller = new InventoryController();

inventoryRoutes.get('/', controller.getAll);
inventoryRoutes.get('/:id', controller.getById);
inventoryRoutes.post('/', controller.create);
inventoryRoutes.put('/:id', controller.update);
inventoryRoutes.delete('/:id', controller.remove);
