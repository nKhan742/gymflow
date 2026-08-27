import { Router } from 'express';
import { AttendanceReportsController } from '../controller/attendance-reports.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createAttendanceReportsSchema, updateAttendanceReportsSchema } from '../validation/attendance-reports.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { ATTENDANCE_REPORTS_PERMISSIONS } from '../permissions/attendance-reports.permissions.js';

const router = Router();
const controller = new AttendanceReportsController();

router.get('/', requirePermission(ATTENDANCE_REPORTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(ATTENDANCE_REPORTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(ATTENDANCE_REPORTS_PERMISSIONS.CREATE), validateRequest(createAttendanceReportsSchema), controller.create);
router.put('/:id', requirePermission(ATTENDANCE_REPORTS_PERMISSIONS.UPDATE), validateRequest(updateAttendanceReportsSchema), controller.update);
router.delete('/:id', requirePermission(ATTENDANCE_REPORTS_PERMISSIONS.DELETE), controller.remove);

export const attendanceReportsRoutes = router;
