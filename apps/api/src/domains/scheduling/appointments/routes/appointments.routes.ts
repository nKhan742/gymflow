import { Router } from 'express';
import { AppointmentsController } from '../controller/appointments.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createAppointmentsSchema, updateAppointmentsSchema } from '../validation/appointments.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { APPOINTMENTS_PERMISSIONS } from '../permissions/appointments.permissions.js';

const router = Router();
const controller = new AppointmentsController();

router.get('/', requirePermission(APPOINTMENTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(APPOINTMENTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(APPOINTMENTS_PERMISSIONS.CREATE), validateRequest(createAppointmentsSchema), controller.create);
router.put('/:id', requirePermission(APPOINTMENTS_PERMISSIONS.UPDATE), validateRequest(updateAppointmentsSchema), controller.update);
router.delete('/:id', requirePermission(APPOINTMENTS_PERMISSIONS.DELETE), controller.remove);

export const appointmentsRoutes = router;
