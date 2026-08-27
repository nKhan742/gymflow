import { Router } from 'express';
import { InvoicesController } from '../controller/invoices.controller.js';

export const invoicesRoutes = Router();
const controller = new InvoicesController();

invoicesRoutes.get('/', controller.list);
invoicesRoutes.get('/:id', controller.getById);
invoicesRoutes.post('/', controller.create);
