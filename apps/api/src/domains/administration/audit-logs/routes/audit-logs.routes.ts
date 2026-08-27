import { Router } from 'express';
import { AuditLogsController } from '../controller/audit-logs.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createAuditLogsSchema, updateAuditLogsSchema } from '../validation/audit-logs.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { AUDIT_LOGS_PERMISSIONS } from '../permissions/audit-logs.permissions.js';

const router = Router();
const controller = new AuditLogsController();

router.get('/', requirePermission(AUDIT_LOGS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(AUDIT_LOGS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(AUDIT_LOGS_PERMISSIONS.CREATE), validateRequest(createAuditLogsSchema), controller.create);
router.put('/:id', requirePermission(AUDIT_LOGS_PERMISSIONS.UPDATE), validateRequest(updateAuditLogsSchema), controller.update);
router.delete('/:id', requirePermission(AUDIT_LOGS_PERMISSIONS.DELETE), controller.remove);

export const auditLogsRoutes = router;
