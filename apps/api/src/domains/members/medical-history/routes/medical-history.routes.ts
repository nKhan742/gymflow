import { Router } from 'express';
import { MedicalHistoryController } from '../controller/medical-history.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMedicalHistorySchema, updateMedicalHistorySchema } from '../validation/medical-history.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MEDICAL_HISTORY_PERMISSIONS } from '../permissions/medical-history.permissions.js';

const router = Router();
const controller = new MedicalHistoryController();

router.get('/', requirePermission(MEDICAL_HISTORY_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MEDICAL_HISTORY_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MEDICAL_HISTORY_PERMISSIONS.CREATE), validateRequest(createMedicalHistorySchema), controller.create);
router.put('/:id', requirePermission(MEDICAL_HISTORY_PERMISSIONS.UPDATE), validateRequest(updateMedicalHistorySchema), controller.update);
router.delete('/:id', requirePermission(MEDICAL_HISTORY_PERMISSIONS.DELETE), controller.remove);

export const medicalHistoryRoutes = router;
