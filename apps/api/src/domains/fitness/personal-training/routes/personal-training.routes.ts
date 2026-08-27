import { Router } from 'express';
import { PersonalTrainingController } from '../controller/personal-training.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createPersonalTrainingSchema, updatePersonalTrainingSchema } from '../validation/personal-training.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { PERSONAL_TRAINING_PERMISSIONS } from '../permissions/personal-training.permissions.js';

const router = Router();
const controller = new PersonalTrainingController();

router.get('/', requirePermission(PERSONAL_TRAINING_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(PERSONAL_TRAINING_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(PERSONAL_TRAINING_PERMISSIONS.CREATE), validateRequest(createPersonalTrainingSchema), controller.create);
router.put('/:id', requirePermission(PERSONAL_TRAINING_PERMISSIONS.UPDATE), validateRequest(updatePersonalTrainingSchema), controller.update);
router.delete('/:id', requirePermission(PERSONAL_TRAINING_PERMISSIONS.DELETE), controller.remove);

export const personalTrainingRoutes = router;
