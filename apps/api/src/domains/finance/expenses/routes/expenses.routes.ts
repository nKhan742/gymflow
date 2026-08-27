import { Router } from 'express';
import { ExpensesController } from '../controller/expenses.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createExpensesSchema, updateExpensesSchema } from '../validation/expenses.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { EXPENSES_PERMISSIONS } from '../permissions/expenses.permissions.js';

const router = Router();
const controller = new ExpensesController();

router.get('/', requirePermission(EXPENSES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(EXPENSES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(EXPENSES_PERMISSIONS.CREATE), validateRequest(createExpensesSchema), controller.create);
router.put('/:id', requirePermission(EXPENSES_PERMISSIONS.UPDATE), validateRequest(updateExpensesSchema), controller.update);
router.delete('/:id', requirePermission(EXPENSES_PERMISSIONS.DELETE), controller.remove);

export const expensesRoutes = router;
