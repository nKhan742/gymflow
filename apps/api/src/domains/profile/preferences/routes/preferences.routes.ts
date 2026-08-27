import { Router } from 'express';
import { PreferencesController } from '../controller/preferences.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createPreferencesSchema, updatePreferencesSchema } from '../validation/preferences.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { PREFERENCES_PERMISSIONS } from '../permissions/preferences.permissions.js';

const router = Router();
const controller = new PreferencesController();

router.get('/', requirePermission(PREFERENCES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(PREFERENCES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(PREFERENCES_PERMISSIONS.CREATE), validateRequest(createPreferencesSchema), controller.create);
router.put('/:id', requirePermission(PREFERENCES_PERMISSIONS.UPDATE), validateRequest(updatePreferencesSchema), controller.update);
router.delete('/:id', requirePermission(PREFERENCES_PERMISSIONS.DELETE), controller.remove);

export const preferencesRoutes = router;
