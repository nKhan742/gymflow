import { Router } from 'express';
import { AnnouncementsController } from '../controller/announcements.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createAnnouncementsSchema, updateAnnouncementsSchema } from '../validation/announcements.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { ANNOUNCEMENTS_PERMISSIONS } from '../permissions/announcements.permissions.js';

const router = Router();
const controller = new AnnouncementsController();

router.get('/', requirePermission(ANNOUNCEMENTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(ANNOUNCEMENTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(ANNOUNCEMENTS_PERMISSIONS.CREATE), validateRequest(createAnnouncementsSchema), controller.create);
router.put('/:id', requirePermission(ANNOUNCEMENTS_PERMISSIONS.UPDATE), validateRequest(updateAnnouncementsSchema), controller.update);
router.delete('/:id', requirePermission(ANNOUNCEMENTS_PERMISSIONS.DELETE), controller.remove);

export const announcementsRoutes = router;
