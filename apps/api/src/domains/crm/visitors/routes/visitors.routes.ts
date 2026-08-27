import { Router } from 'express';
import { VisitorsController } from '../controller/visitors.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createVisitorsSchema, updateVisitorsSchema } from '../validation/visitors.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { VISITORS_PERMISSIONS } from '../permissions/visitors.permissions.js';

const router = Router();
const controller = new VisitorsController();

router.get('/', requirePermission(VISITORS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(VISITORS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(VISITORS_PERMISSIONS.CREATE), validateRequest(createVisitorsSchema), controller.create);
router.put('/:id', requirePermission(VISITORS_PERMISSIONS.UPDATE), validateRequest(updateVisitorsSchema), controller.update);
router.delete('/:id', requirePermission(VISITORS_PERMISSIONS.DELETE), controller.remove);

export const visitorsRoutes = router;
