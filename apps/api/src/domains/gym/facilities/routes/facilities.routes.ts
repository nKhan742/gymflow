import { Router } from 'express';
import { FacilitiesController } from '../controller/facilities.controller.js';

export const facilitiesRoutes = Router();
const controller = new FacilitiesController();

facilitiesRoutes.get('/', controller.list);
facilitiesRoutes.post('/', controller.create);

