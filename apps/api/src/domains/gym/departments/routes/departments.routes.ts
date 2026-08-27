import { Router } from 'express';
import { DepartmentsController } from '../controller/departments.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createDepartmentsSchema, updateDepartmentsSchema } from '../validation/departments.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { DEPARTMENTS_PERMISSIONS } from '../permissions/departments.permissions.js';

const router = Router();
const controller = new DepartmentsController();

router.get('/', requirePermission(DEPARTMENTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(DEPARTMENTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(DEPARTMENTS_PERMISSIONS.CREATE), validateRequest(createDepartmentsSchema), controller.create);
router.put('/:id', requirePermission(DEPARTMENTS_PERMISSIONS.UPDATE), validateRequest(updateDepartmentsSchema), controller.update);
router.delete('/:id', requirePermission(DEPARTMENTS_PERMISSIONS.DELETE), controller.remove);

export const departmentsRoutes = router;
