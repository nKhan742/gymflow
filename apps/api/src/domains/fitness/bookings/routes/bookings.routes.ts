import { Router } from 'express';
import { BookingsController } from '../controller/bookings.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createBookingsSchema, updateBookingsSchema } from '../validation/bookings.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { BOOKINGS_PERMISSIONS } from '../permissions/bookings.permissions.js';

const router = Router();
const controller = new BookingsController();

router.get('/', requirePermission(BOOKINGS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(BOOKINGS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(BOOKINGS_PERMISSIONS.CREATE), validateRequest(createBookingsSchema), controller.create);
router.put('/:id', requirePermission(BOOKINGS_PERMISSIONS.UPDATE), validateRequest(updateBookingsSchema), controller.update);
router.delete('/:id', requirePermission(BOOKINGS_PERMISSIONS.DELETE), controller.remove);

export const bookingsRoutes = router;
