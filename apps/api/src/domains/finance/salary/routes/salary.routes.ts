import { Router } from 'express';
import { SalaryController } from '../controller/salary.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createSalarySchema, updateSalarySchema } from '../validation/salary.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { SALARY_PERMISSIONS } from '../permissions/salary.permissions.js';

const router = Router();
const controller = new SalaryController();

router.get('/', requirePermission(SALARY_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(SALARY_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(SALARY_PERMISSIONS.CREATE), validateRequest(createSalarySchema), controller.create);
router.put('/:id', requirePermission(SALARY_PERMISSIONS.UPDATE), validateRequest(updateSalarySchema), controller.update);
router.delete('/:id', requirePermission(SALARY_PERMISSIONS.DELETE), controller.remove);

export const salaryRoutes = router;
