import { Router } from 'express';
import { EmailController } from '../controller/email.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createEmailSchema, updateEmailSchema } from '../validation/email.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { EMAIL_PERMISSIONS } from '../permissions/email.permissions.js';

const router = Router();
const controller = new EmailController();

router.get('/', requirePermission(EMAIL_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(EMAIL_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(EMAIL_PERMISSIONS.CREATE), validateRequest(createEmailSchema), controller.create);
router.put('/:id', requirePermission(EMAIL_PERMISSIONS.UPDATE), validateRequest(updateEmailSchema), controller.update);
router.delete('/:id', requirePermission(EMAIL_PERMISSIONS.DELETE), controller.remove);

export const emailRoutes = router;
