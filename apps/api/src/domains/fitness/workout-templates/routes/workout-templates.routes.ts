import { Router } from 'express';
import { WorkoutTemplatesController } from '../controller/workout-templates.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createWorkoutTemplatesSchema, updateWorkoutTemplatesSchema } from '../validation/workout-templates.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { WORKOUT_TEMPLATES_PERMISSIONS } from '../permissions/workout-templates.permissions.js';

const router = Router();
const controller = new WorkoutTemplatesController();

router.get('/', requirePermission(WORKOUT_TEMPLATES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(WORKOUT_TEMPLATES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(WORKOUT_TEMPLATES_PERMISSIONS.CREATE), validateRequest(createWorkoutTemplatesSchema), controller.create);
router.put('/:id', requirePermission(WORKOUT_TEMPLATES_PERMISSIONS.UPDATE), validateRequest(updateWorkoutTemplatesSchema), controller.update);
router.delete('/:id', requirePermission(WORKOUT_TEMPLATES_PERMISSIONS.DELETE), controller.remove);

export const workoutTemplatesRoutes = router;
