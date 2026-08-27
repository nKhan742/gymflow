import { Router } from 'express';
import { ResourceBookingController } from '../controller/resource-booking.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createResourceBookingSchema, updateResourceBookingSchema } from '../validation/resource-booking.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { RESOURCE_BOOKING_PERMISSIONS } from '../permissions/resource-booking.permissions.js';

const router = Router();
const controller = new ResourceBookingController();

router.get('/', requirePermission(RESOURCE_BOOKING_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(RESOURCE_BOOKING_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(RESOURCE_BOOKING_PERMISSIONS.CREATE), validateRequest(createResourceBookingSchema), controller.create);
router.put('/:id', requirePermission(RESOURCE_BOOKING_PERMISSIONS.UPDATE), validateRequest(updateResourceBookingSchema), controller.update);
router.delete('/:id', requirePermission(RESOURCE_BOOKING_PERMISSIONS.DELETE), controller.remove);

export const resourceBookingRoutes = router;
