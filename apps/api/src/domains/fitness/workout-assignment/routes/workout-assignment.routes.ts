import { Router } from 'express';
import { WorkoutAssignmentController } from '../controller/workout-assignment.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createWorkoutAssignmentSchema, updateWorkoutAssignmentSchema } from '../validation/workout-assignment.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { WORKOUT_ASSIGNMENT_PERMISSIONS } from '../permissions/workout-assignment.permissions.js';

const router = Router();
const controller = new WorkoutAssignmentController();

router.get('/', requirePermission(WORKOUT_ASSIGNMENT_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(WORKOUT_ASSIGNMENT_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(WORKOUT_ASSIGNMENT_PERMISSIONS.CREATE), validateRequest(createWorkoutAssignmentSchema), controller.create);
router.put('/:id', requirePermission(WORKOUT_ASSIGNMENT_PERMISSIONS.UPDATE), validateRequest(updateWorkoutAssignmentSchema), controller.update);
router.delete('/:id', requirePermission(WORKOUT_ASSIGNMENT_PERMISSIONS.DELETE), controller.remove);

export const workoutAssignmentRoutes = router;
