import { Router } from 'express';
import { WhatsappController } from '../controller/whatsapp.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createWhatsappSchema, updateWhatsappSchema } from '../validation/whatsapp.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { WHATSAPP_PERMISSIONS } from '../permissions/whatsapp.permissions.js';

const router = Router();
const controller = new WhatsappController();

router.get('/', requirePermission(WHATSAPP_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(WHATSAPP_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(WHATSAPP_PERMISSIONS.CREATE), validateRequest(createWhatsappSchema), controller.create);
router.put('/:id', requirePermission(WHATSAPP_PERMISSIONS.UPDATE), validateRequest(updateWhatsappSchema), controller.update);
router.delete('/:id', requirePermission(WHATSAPP_PERMISSIONS.DELETE), controller.remove);

export const whatsappRoutes = router;
