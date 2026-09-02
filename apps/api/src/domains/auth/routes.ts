import { Router } from 'express';
import { AuthController } from './controllers/auth.controller.js';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';

export const authDomainRoutes = Router();
const controller = new AuthController();

// Public routes
authDomainRoutes.post('/register', controller.register);
authDomainRoutes.post('/login', controller.login);
authDomainRoutes.post('/logout', controller.logout);
authDomainRoutes.post('/refresh', controller.refresh);

// Protected route
authDomainRoutes.get('/me', authMiddleware, controller.me);
