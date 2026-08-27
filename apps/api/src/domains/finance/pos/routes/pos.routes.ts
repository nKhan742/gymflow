import { Router } from 'express';
import { PosController } from '../controller/pos.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createPosSchema, updatePosSchema } from '../validation/pos.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { POS_PERMISSIONS } from '../permissions/pos.permissions.js';

const router = Router();
const controller = new PosController();

router.get('/', requirePermission(POS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(POS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(POS_PERMISSIONS.CREATE), validateRequest(createPosSchema), controller.create);
router.put('/:id', requirePermission(POS_PERMISSIONS.UPDATE), validateRequest(updatePosSchema), controller.update);
router.delete('/:id', requirePermission(POS_PERMISSIONS.DELETE), controller.remove);

export const posRoutes = router;
