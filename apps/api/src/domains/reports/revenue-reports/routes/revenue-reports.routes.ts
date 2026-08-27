import { Router } from 'express';
import { RevenueReportsController } from '../controller/revenue-reports.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createRevenueReportsSchema, updateRevenueReportsSchema } from '../validation/revenue-reports.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { REVENUE_REPORTS_PERMISSIONS } from '../permissions/revenue-reports.permissions.js';

const router = Router();
const controller = new RevenueReportsController();

router.get('/', requirePermission(REVENUE_REPORTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(REVENUE_REPORTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(REVENUE_REPORTS_PERMISSIONS.CREATE), validateRequest(createRevenueReportsSchema), controller.create);
router.put('/:id', requirePermission(REVENUE_REPORTS_PERMISSIONS.UPDATE), validateRequest(updateRevenueReportsSchema), controller.update);
router.delete('/:id', requirePermission(REVENUE_REPORTS_PERMISSIONS.DELETE), controller.remove);

export const revenueReportsRoutes = router;
