import { Router } from 'express';
import { ActivityLogsController } from '../controller/activity-logs.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createActivityLogsSchema, updateActivityLogsSchema } from '../validation/activity-logs.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { ACTIVITY_LOGS_PERMISSIONS } from '../permissions/activity-logs.permissions.js';

const router = Router();
const controller = new ActivityLogsController();

router.get('/', requirePermission(ACTIVITY_LOGS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(ACTIVITY_LOGS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(ACTIVITY_LOGS_PERMISSIONS.CREATE), validateRequest(createActivityLogsSchema), controller.create);
router.put('/:id', requirePermission(ACTIVITY_LOGS_PERMISSIONS.UPDATE), validateRequest(updateActivityLogsSchema), controller.update);
router.delete('/:id', requirePermission(ACTIVITY_LOGS_PERMISSIONS.DELETE), controller.remove);

export const activityLogsRoutes = router;
