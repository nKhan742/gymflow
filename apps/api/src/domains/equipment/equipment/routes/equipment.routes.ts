import { Router } from 'express';
import { EquipmentController } from '../controller/equipment.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createEquipmentSchema, updateEquipmentSchema } from '../validation/equipment.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { EQUIPMENT_PERMISSIONS } from '../permissions/equipment.permissions.js';

const router = Router();
const controller = new EquipmentController();

router.get('/', requirePermission(EQUIPMENT_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(EQUIPMENT_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(EQUIPMENT_PERMISSIONS.CREATE), validateRequest(createEquipmentSchema), controller.create);
router.put('/:id', requirePermission(EQUIPMENT_PERMISSIONS.UPDATE), validateRequest(updateEquipmentSchema), controller.update);
router.delete('/:id', requirePermission(EQUIPMENT_PERMISSIONS.DELETE), controller.remove);

export const equipmentRoutes = router;
