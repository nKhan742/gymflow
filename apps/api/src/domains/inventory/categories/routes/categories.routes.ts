import { Router } from 'express';
import { CategoriesController } from '../controller/categories.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createCategoriesSchema, updateCategoriesSchema } from '../validation/categories.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { CATEGORIES_PERMISSIONS } from '../permissions/categories.permissions.js';

const router = Router();
const controller = new CategoriesController();

router.get('/', requirePermission(CATEGORIES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(CATEGORIES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(CATEGORIES_PERMISSIONS.CREATE), validateRequest(createCategoriesSchema), controller.create);
router.put('/:id', requirePermission(CATEGORIES_PERMISSIONS.UPDATE), validateRequest(updateCategoriesSchema), controller.update);
router.delete('/:id', requirePermission(CATEGORIES_PERMISSIONS.DELETE), controller.remove);

export const categoriesRoutes = router;
