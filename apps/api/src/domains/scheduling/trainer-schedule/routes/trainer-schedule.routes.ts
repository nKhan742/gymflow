import { Router } from 'express';
import { TrainerScheduleController } from '../controller/trainer-schedule.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTrainerScheduleSchema, updateTrainerScheduleSchema } from '../validation/trainer-schedule.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TRAINER_SCHEDULE_PERMISSIONS } from '../permissions/trainer-schedule.permissions.js';

const router = Router();
const controller = new TrainerScheduleController();

router.get('/', requirePermission(TRAINER_SCHEDULE_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TRAINER_SCHEDULE_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TRAINER_SCHEDULE_PERMISSIONS.CREATE), validateRequest(createTrainerScheduleSchema), controller.create);
router.put('/:id', requirePermission(TRAINER_SCHEDULE_PERMISSIONS.UPDATE), validateRequest(updateTrainerScheduleSchema), controller.update);
router.delete('/:id', requirePermission(TRAINER_SCHEDULE_PERMISSIONS.DELETE), controller.remove);

export const trainerScheduleRoutes = router;
