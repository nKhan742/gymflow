import { Router } from 'express';
import { EmergencyContactsController } from '../controller/emergency-contacts.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createEmergencyContactsSchema, updateEmergencyContactsSchema } from '../validation/emergency-contacts.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { EMERGENCY_CONTACTS_PERMISSIONS } from '../permissions/emergency-contacts.permissions.js';

const router = Router();
const controller = new EmergencyContactsController();

router.get('/', requirePermission(EMERGENCY_CONTACTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(EMERGENCY_CONTACTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(EMERGENCY_CONTACTS_PERMISSIONS.CREATE), validateRequest(createEmergencyContactsSchema), controller.create);
router.put('/:id', requirePermission(EMERGENCY_CONTACTS_PERMISSIONS.UPDATE), validateRequest(updateEmergencyContactsSchema), controller.update);
router.delete('/:id', requirePermission(EMERGENCY_CONTACTS_PERMISSIONS.DELETE), controller.remove);

export const emergencyContactsRoutes = router;
