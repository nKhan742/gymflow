import { Router } from 'express';
import { NotificationsController } from '../controller/notifications.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createNotificationsSchema, updateNotificationsSchema } from '../validation/notifications.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { NOTIFICATIONS_PERMISSIONS } from '../permissions/notifications.permissions.js';

const router = Router();
const controller = new NotificationsController();

router.get('/', requirePermission(NOTIFICATIONS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(NOTIFICATIONS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(NOTIFICATIONS_PERMISSIONS.CREATE), validateRequest(createNotificationsSchema), controller.create);
router.put('/:id', requirePermission(NOTIFICATIONS_PERMISSIONS.UPDATE), validateRequest(updateNotificationsSchema), controller.update);
router.delete('/:id', requirePermission(NOTIFICATIONS_PERMISSIONS.DELETE), controller.remove);

export const notificationsRoutes = router;
