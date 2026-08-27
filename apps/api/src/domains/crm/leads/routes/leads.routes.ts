import { Router } from 'express';
import { LeadsController } from '../controller/leads.controller.js';

export const leadsRoutes = Router();
const controller = new LeadsController();

leadsRoutes.get('/', controller.list);
leadsRoutes.post('/', controller.create);
