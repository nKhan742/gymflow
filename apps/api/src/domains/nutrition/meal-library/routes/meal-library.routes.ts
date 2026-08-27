import { Router } from 'express';
import { MealLibraryController } from '../controller/meal-library.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMealLibrarySchema, updateMealLibrarySchema } from '../validation/meal-library.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MEAL_LIBRARY_PERMISSIONS } from '../permissions/meal-library.permissions.js';

const router = Router();
const controller = new MealLibraryController();

router.get('/', requirePermission(MEAL_LIBRARY_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MEAL_LIBRARY_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MEAL_LIBRARY_PERMISSIONS.CREATE), validateRequest(createMealLibrarySchema), controller.create);
router.put('/:id', requirePermission(MEAL_LIBRARY_PERMISSIONS.UPDATE), validateRequest(updateMealLibrarySchema), controller.update);
router.delete('/:id', requirePermission(MEAL_LIBRARY_PERMISSIONS.DELETE), controller.remove);

export const mealLibraryRoutes = router;
