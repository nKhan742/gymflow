import { Router } from 'express';
import { TrainerReportsController } from '../controller/trainer-reports.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTrainerReportsSchema, updateTrainerReportsSchema } from '../validation/trainer-reports.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TRAINER_REPORTS_PERMISSIONS } from '../permissions/trainer-reports.permissions.js';

const router = Router();
const controller = new TrainerReportsController();

router.get('/', requirePermission(TRAINER_REPORTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TRAINER_REPORTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TRAINER_REPORTS_PERMISSIONS.CREATE), validateRequest(createTrainerReportsSchema), controller.create);
router.put('/:id', requirePermission(TRAINER_REPORTS_PERMISSIONS.UPDATE), validateRequest(updateTrainerReportsSchema), controller.update);
router.delete('/:id', requirePermission(TRAINER_REPORTS_PERMISSIONS.DELETE), controller.remove);

export const trainerReportsRoutes = router;
