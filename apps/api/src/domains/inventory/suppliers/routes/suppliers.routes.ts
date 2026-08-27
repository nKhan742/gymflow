import { Router } from 'express';
import { SuppliersController } from '../controller/suppliers.controller.js';

export const suppliersRoutes = Router();
const controller = new SuppliersController();

suppliersRoutes.get('/', controller.getAll);
suppliersRoutes.get('/:id', controller.getById);
suppliersRoutes.post('/', controller.create);
suppliersRoutes.put('/:id', controller.update);
suppliersRoutes.delete('/:id', controller.remove);
