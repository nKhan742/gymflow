import { Router } from 'express';
import { MembersController } from '../controller/members.controller.js';
import { authMiddleware } from '../../../../core/middleware/auth.middleware.js';

export const membersRoutes = Router();
const controller = new MembersController();

membersRoutes.get('/', authMiddleware, controller.list);
membersRoutes.get('/:id', authMiddleware, controller.getById);
membersRoutes.post('/', authMiddleware, controller.create);
membersRoutes.put('/:id', authMiddleware, controller.update);
membersRoutes.delete('/:id', authMiddleware, controller.delete);

// Specialized enterprise actions
membersRoutes.post('/:id/freeze', authMiddleware, controller.freeze);
membersRoutes.post('/:id/renew', authMiddleware, controller.renew);
membersRoutes.post('/:id/check-in', authMiddleware, controller.checkIn);
