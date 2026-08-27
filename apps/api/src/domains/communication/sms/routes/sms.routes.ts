import { Router } from 'express';
import { SmsController } from '../controller/sms.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createSmsSchema, updateSmsSchema } from '../validation/sms.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { SMS_PERMISSIONS } from '../permissions/sms.permissions.js';

const router = Router();
const controller = new SmsController();

router.get('/', requirePermission(SMS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(SMS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(SMS_PERMISSIONS.CREATE), validateRequest(createSmsSchema), controller.create);
router.put('/:id', requirePermission(SMS_PERMISSIONS.UPDATE), validateRequest(updateSmsSchema), controller.update);
router.delete('/:id', requirePermission(SMS_PERMISSIONS.DELETE), controller.remove);

export const smsRoutes = router;
