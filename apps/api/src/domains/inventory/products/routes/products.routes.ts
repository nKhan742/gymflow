import { Router } from 'express';
import { ProductsController } from '../controller/products.controller.js';

export const productsRoutes = Router();
const controller = new ProductsController();

productsRoutes.get('/', controller.getAll);
productsRoutes.get('/:id', controller.getById);
productsRoutes.post('/', controller.create);
productsRoutes.put('/:id', controller.update);
productsRoutes.delete('/:id', controller.remove);
