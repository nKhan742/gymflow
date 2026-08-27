import { Router } from 'express';
import { ServiceHistoryController } from '../controller/service-history.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createServiceHistorySchema, updateServiceHistorySchema } from '../validation/service-history.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { SERVICE_HISTORY_PERMISSIONS } from '../permissions/service-history.permissions.js';

const router = Router();
const controller = new ServiceHistoryController();

router.get('/', requirePermission(SERVICE_HISTORY_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(SERVICE_HISTORY_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(SERVICE_HISTORY_PERMISSIONS.CREATE), validateRequest(createServiceHistorySchema), controller.create);
router.put('/:id', requirePermission(SERVICE_HISTORY_PERMISSIONS.UPDATE), validateRequest(updateServiceHistorySchema), controller.update);
router.delete('/:id', requirePermission(SERVICE_HISTORY_PERMISSIONS.DELETE), controller.remove);

export const serviceHistoryRoutes = router;
