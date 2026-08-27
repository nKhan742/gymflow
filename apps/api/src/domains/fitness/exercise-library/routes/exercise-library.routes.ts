import { Router } from 'express';
import { ExerciseLibraryController } from '../controller/exercise-library.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createExerciseLibrarySchema, updateExerciseLibrarySchema } from '../validation/exercise-library.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { EXERCISE_LIBRARY_PERMISSIONS } from '../permissions/exercise-library.permissions.js';

const router = Router();
const controller = new ExerciseLibraryController();

router.get('/', requirePermission(EXERCISE_LIBRARY_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(EXERCISE_LIBRARY_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(EXERCISE_LIBRARY_PERMISSIONS.CREATE), validateRequest(createExerciseLibrarySchema), controller.create);
router.put('/:id', requirePermission(EXERCISE_LIBRARY_PERMISSIONS.UPDATE), validateRequest(updateExerciseLibrarySchema), controller.update);
router.delete('/:id', requirePermission(EXERCISE_LIBRARY_PERMISSIONS.DELETE), controller.remove);

export const exerciseLibraryRoutes = router;
