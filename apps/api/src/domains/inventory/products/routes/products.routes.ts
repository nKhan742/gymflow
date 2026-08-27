import { Router } from 'express';
import { ProductsController } from '../controller/products.controller.js';

export const productsRoutes = Router();
const controller = new ProductsController();

productsRoutes.get('/', controller.list);
productsRoutes.post('/', controller.create);
