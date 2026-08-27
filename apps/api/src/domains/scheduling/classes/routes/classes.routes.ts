import { Router } from 'express';
import { ClassesController } from '../controller/classes.controller.js';

export const classesRoutes = Router();
const controller = new ClassesController();

classesRoutes.get('/', controller.list);
classesRoutes.post('/', controller.create);

