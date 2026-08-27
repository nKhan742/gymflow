import { Router } from 'express';
import { AttendanceAnalyticsController } from '../controller/attendance-analytics.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createAttendanceAnalyticsSchema, updateAttendanceAnalyticsSchema } from '../validation/attendance-analytics.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { ATTENDANCE_ANALYTICS_PERMISSIONS } from '../permissions/attendance-analytics.permissions.js';

const router = Router();
const controller = new AttendanceAnalyticsController();

router.get('/', requirePermission(ATTENDANCE_ANALYTICS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(ATTENDANCE_ANALYTICS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(ATTENDANCE_ANALYTICS_PERMISSIONS.CREATE), validateRequest(createAttendanceAnalyticsSchema), controller.create);
router.put('/:id', requirePermission(ATTENDANCE_ANALYTICS_PERMISSIONS.UPDATE), validateRequest(updateAttendanceAnalyticsSchema), controller.update);
router.delete('/:id', requirePermission(ATTENDANCE_ANALYTICS_PERMISSIONS.DELETE), controller.remove);

export const attendanceAnalyticsRoutes = router;
