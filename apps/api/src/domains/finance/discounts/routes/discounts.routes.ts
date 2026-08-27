import { Router } from 'express';
import { DiscountsController } from '../controller/discounts.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createDiscountsSchema, updateDiscountsSchema } from '../validation/discounts.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { DISCOUNTS_PERMISSIONS } from '../permissions/discounts.permissions.js';

const router = Router();
const controller = new DiscountsController();

router.get('/', requirePermission(DISCOUNTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(DISCOUNTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(DISCOUNTS_PERMISSIONS.CREATE), validateRequest(createDiscountsSchema), controller.create);
router.put('/:id', requirePermission(DISCOUNTS_PERMISSIONS.UPDATE), validateRequest(updateDiscountsSchema), controller.update);
router.delete('/:id', requirePermission(DISCOUNTS_PERMISSIONS.DELETE), controller.remove);

export const discountsRoutes = router;
