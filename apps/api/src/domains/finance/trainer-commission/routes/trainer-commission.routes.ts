import { Router } from 'express';
import { TrainerCommissionController } from '../controller/trainer-commission.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTrainerCommissionSchema, updateTrainerCommissionSchema } from '../validation/trainer-commission.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TRAINER_COMMISSION_PERMISSIONS } from '../permissions/trainer-commission.permissions.js';

const router = Router();
const controller = new TrainerCommissionController();

router.get('/', requirePermission(TRAINER_COMMISSION_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TRAINER_COMMISSION_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TRAINER_COMMISSION_PERMISSIONS.CREATE), validateRequest(createTrainerCommissionSchema), controller.create);
router.put('/:id', requirePermission(TRAINER_COMMISSION_PERMISSIONS.UPDATE), validateRequest(updateTrainerCommissionSchema), controller.update);
router.delete('/:id', requirePermission(TRAINER_COMMISSION_PERMISSIONS.DELETE), controller.remove);

export const trainerCommissionRoutes = router;
