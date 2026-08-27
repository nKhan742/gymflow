import { Router } from 'express';
import { SettingsController } from '../controller/settings.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createSettingsSchema, updateSettingsSchema } from '../validation/settings.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { SETTINGS_PERMISSIONS } from '../permissions/settings.permissions.js';

const router = Router();
const controller = new SettingsController();

router.get('/', requirePermission(SETTINGS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(SETTINGS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(SETTINGS_PERMISSIONS.CREATE), validateRequest(createSettingsSchema), controller.create);
router.put('/:id', requirePermission(SETTINGS_PERMISSIONS.UPDATE), validateRequest(updateSettingsSchema), controller.update);
router.delete('/:id', requirePermission(SETTINGS_PERMISSIONS.DELETE), controller.remove);

export const settingsRoutes = router;
