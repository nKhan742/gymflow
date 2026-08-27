import { Router } from 'express';
import { CalendarController } from '../controller/calendar.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createCalendarSchema, updateCalendarSchema } from '../validation/calendar.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { CALENDAR_PERMISSIONS } from '../permissions/calendar.permissions.js';

const router = Router();
const controller = new CalendarController();

router.get('/', requirePermission(CALENDAR_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(CALENDAR_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(CALENDAR_PERMISSIONS.CREATE), validateRequest(createCalendarSchema), controller.create);
router.put('/:id', requirePermission(CALENDAR_PERMISSIONS.UPDATE), validateRequest(updateCalendarSchema), controller.update);
router.delete('/:id', requirePermission(CALENDAR_PERMISSIONS.DELETE), controller.remove);

export const calendarRoutes = router;
