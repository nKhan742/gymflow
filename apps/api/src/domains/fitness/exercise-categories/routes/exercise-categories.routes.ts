import { Router } from 'express';
import { ExerciseCategoriesController } from '../controller/exercise-categories.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createExerciseCategoriesSchema, updateExerciseCategoriesSchema } from '../validation/exercise-categories.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { EXERCISE_CATEGORIES_PERMISSIONS } from '../permissions/exercise-categories.permissions.js';

const router = Router();
const controller = new ExerciseCategoriesController();

router.get('/', requirePermission(EXERCISE_CATEGORIES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(EXERCISE_CATEGORIES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(EXERCISE_CATEGORIES_PERMISSIONS.CREATE), validateRequest(createExerciseCategoriesSchema), controller.create);
router.put('/:id', requirePermission(EXERCISE_CATEGORIES_PERMISSIONS.UPDATE), validateRequest(updateExerciseCategoriesSchema), controller.update);
router.delete('/:id', requirePermission(EXERCISE_CATEGORIES_PERMISSIONS.DELETE), controller.remove);

export const exerciseCategoriesRoutes = router;
