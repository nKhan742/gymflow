import { Router } from 'express';
import { FeatureFlagsController } from '../controller/feature-flags.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createFeatureFlagsSchema, updateFeatureFlagsSchema } from '../validation/feature-flags.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { FEATURE_FLAGS_PERMISSIONS } from '../permissions/feature-flags.permissions.js';

const router = Router();
const controller = new FeatureFlagsController();

router.get('/', requirePermission(FEATURE_FLAGS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(FEATURE_FLAGS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(FEATURE_FLAGS_PERMISSIONS.CREATE), validateRequest(createFeatureFlagsSchema), controller.create);
router.put('/:id', requirePermission(FEATURE_FLAGS_PERMISSIONS.UPDATE), validateRequest(updateFeatureFlagsSchema), controller.update);
router.delete('/:id', requirePermission(FEATURE_FLAGS_PERMISSIONS.DELETE), controller.remove);

export const featureFlagsRoutes = router;
