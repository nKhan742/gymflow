import { Router } from 'express';
import { AttendanceController } from '../controller/attendance.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createAttendanceSchema, updateAttendanceSchema } from '../validation/attendance.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { ATTENDANCE_PERMISSIONS } from '../permissions/attendance.permissions.js';

const router = Router();
const controller = new AttendanceController();

router.get('/', requirePermission(ATTENDANCE_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(ATTENDANCE_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(ATTENDANCE_PERMISSIONS.CREATE), validateRequest(createAttendanceSchema), controller.create);
router.put('/:id', requirePermission(ATTENDANCE_PERMISSIONS.UPDATE), validateRequest(updateAttendanceSchema), controller.update);
router.delete('/:id', requirePermission(ATTENDANCE_PERMISSIONS.DELETE), controller.remove);

export const attendanceRoutes = router;
