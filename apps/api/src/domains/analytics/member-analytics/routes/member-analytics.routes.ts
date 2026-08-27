import { Router } from 'express';
import { MemberAnalyticsController } from '../controller/member-analytics.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMemberAnalyticsSchema, updateMemberAnalyticsSchema } from '../validation/member-analytics.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MEMBER_ANALYTICS_PERMISSIONS } from '../permissions/member-analytics.permissions.js';

const router = Router();
const controller = new MemberAnalyticsController();

router.get('/', requirePermission(MEMBER_ANALYTICS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MEMBER_ANALYTICS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MEMBER_ANALYTICS_PERMISSIONS.CREATE), validateRequest(createMemberAnalyticsSchema), controller.create);
router.put('/:id', requirePermission(MEMBER_ANALYTICS_PERMISSIONS.UPDATE), validateRequest(updateMemberAnalyticsSchema), controller.update);
router.delete('/:id', requirePermission(MEMBER_ANALYTICS_PERMISSIONS.DELETE), controller.remove);

export const memberAnalyticsRoutes = router;
