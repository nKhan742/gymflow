import { Router } from 'express';
import { MembersController } from '../controller/members.controller.js';

export const membersRoutes = Router();
const controller = new MembersController();

membersRoutes.get('/', controller.list);
membersRoutes.get('/:id', controller.getById);
membersRoutes.post('/', controller.create);
membersRoutes.put('/:id', controller.update);
membersRoutes.delete('/:id', controller.delete);

// Specialized enterprise actions
membersRoutes.post('/:id/freeze', controller.freeze);
membersRoutes.post('/:id/renew', controller.renew);
membersRoutes.post('/:id/check-in', controller.checkIn);
