import { Router } from 'express';
import { ProgressController } from '../controller/progress.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createProgressSchema, updateProgressSchema } from '../validation/progress.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { PROGRESS_PERMISSIONS } from '../permissions/progress.permissions.js';

const router = Router();
const controller = new ProgressController();

router.get('/', requirePermission(PROGRESS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(PROGRESS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(PROGRESS_PERMISSIONS.CREATE), validateRequest(createProgressSchema), controller.create);
router.put('/:id', requirePermission(PROGRESS_PERMISSIONS.UPDATE), validateRequest(updateProgressSchema), controller.update);
router.delete('/:id', requirePermission(PROGRESS_PERMISSIONS.DELETE), controller.remove);

export const progressRoutes = router;
