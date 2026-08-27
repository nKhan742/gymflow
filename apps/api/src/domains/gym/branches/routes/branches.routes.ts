import { Router } from 'express';
import { BranchesController } from '../controller/branches.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createBranchesSchema, updateBranchesSchema } from '../validation/branches.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { BRANCHES_PERMISSIONS } from '../permissions/branches.permissions.js';

const router = Router();
const controller = new BranchesController();

router.get('/', requirePermission(BRANCHES_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(BRANCHES_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(BRANCHES_PERMISSIONS.CREATE), validateRequest(createBranchesSchema), controller.create);
router.put('/:id', requirePermission(BRANCHES_PERMISSIONS.UPDATE), validateRequest(updateBranchesSchema), controller.update);
router.delete('/:id', requirePermission(BRANCHES_PERMISSIONS.DELETE), controller.remove);

export const branchesRoutes = router;
