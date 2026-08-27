import { Router } from 'express';
import { CategoriesController } from '../controller/categories.controller.js';

export const categoriesRoutes = Router();
const controller = new CategoriesController();

categoriesRoutes.get('/', controller.getAll);
categoriesRoutes.get('/:id', controller.getById);
categoriesRoutes.post('/', controller.create);
categoriesRoutes.put('/:id', controller.update);
categoriesRoutes.delete('/:id', controller.remove);
