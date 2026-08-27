import { Router } from 'express';
import { MaintenanceController } from '../controller/maintenance.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMaintenanceSchema, updateMaintenanceSchema } from '../validation/maintenance.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MAINTENANCE_PERMISSIONS } from '../permissions/maintenance.permissions.js';

const router = Router();
const controller = new MaintenanceController();

router.get('/', requirePermission(MAINTENANCE_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MAINTENANCE_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MAINTENANCE_PERMISSIONS.CREATE), validateRequest(createMaintenanceSchema), controller.create);
router.put('/:id', requirePermission(MAINTENANCE_PERMISSIONS.UPDATE), validateRequest(updateMaintenanceSchema), controller.update);
router.delete('/:id', requirePermission(MAINTENANCE_PERMISSIONS.DELETE), controller.remove);

export const maintenanceRoutes = router;
