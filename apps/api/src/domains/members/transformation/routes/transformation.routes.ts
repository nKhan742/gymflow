import { Router } from 'express';
import { TransformationController } from '../controller/transformation.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTransformationSchema, updateTransformationSchema } from '../validation/transformation.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TRANSFORMATION_PERMISSIONS } from '../permissions/transformation.permissions.js';

const router = Router();
const controller = new TransformationController();

router.get('/', requirePermission(TRANSFORMATION_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TRANSFORMATION_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TRANSFORMATION_PERMISSIONS.CREATE), validateRequest(createTransformationSchema), controller.create);
router.put('/:id', requirePermission(TRANSFORMATION_PERMISSIONS.UPDATE), validateRequest(updateTransformationSchema), controller.update);
router.delete('/:id', requirePermission(TRANSFORMATION_PERMISSIONS.DELETE), controller.remove);

export const transformationRoutes = router;
