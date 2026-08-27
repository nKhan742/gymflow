import { Router } from 'express';
import { FinanceReportsController } from '../controller/finance-reports.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createFinanceReportsSchema, updateFinanceReportsSchema } from '../validation/finance-reports.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { FINANCE_REPORTS_PERMISSIONS } from '../permissions/finance-reports.permissions.js';

const router = Router();
const controller = new FinanceReportsController();

router.get('/', requirePermission(FINANCE_REPORTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(FINANCE_REPORTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(FINANCE_REPORTS_PERMISSIONS.CREATE), validateRequest(createFinanceReportsSchema), controller.create);
router.put('/:id', requirePermission(FINANCE_REPORTS_PERMISSIONS.UPDATE), validateRequest(updateFinanceReportsSchema), controller.update);
router.delete('/:id', requirePermission(FINANCE_REPORTS_PERMISSIONS.DELETE), controller.remove);

export const financeReportsRoutes = router;
