import { Router } from 'express';
import { MemberReportsController } from '../controller/member-reports.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createMemberReportsSchema, updateMemberReportsSchema } from '../validation/member-reports.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { MEMBER_REPORTS_PERMISSIONS } from '../permissions/member-reports.permissions.js';

const router = Router();
const controller = new MemberReportsController();

router.get('/', requirePermission(MEMBER_REPORTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(MEMBER_REPORTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(MEMBER_REPORTS_PERMISSIONS.CREATE), validateRequest(createMemberReportsSchema), controller.create);
router.put('/:id', requirePermission(MEMBER_REPORTS_PERMISSIONS.UPDATE), validateRequest(updateMemberReportsSchema), controller.update);
router.delete('/:id', requirePermission(MEMBER_REPORTS_PERMISSIONS.DELETE), controller.remove);

export const memberReportsRoutes = router;
