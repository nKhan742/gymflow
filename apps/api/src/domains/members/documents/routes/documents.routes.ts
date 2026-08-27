import { Router } from 'express';
import { DocumentsController } from '../controller/documents.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createDocumentsSchema, updateDocumentsSchema } from '../validation/documents.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { DOCUMENTS_PERMISSIONS } from '../permissions/documents.permissions.js';

const router = Router();
const controller = new DocumentsController();

router.get('/', requirePermission(DOCUMENTS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(DOCUMENTS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(DOCUMENTS_PERMISSIONS.CREATE), validateRequest(createDocumentsSchema), controller.create);
router.put('/:id', requirePermission(DOCUMENTS_PERMISSIONS.UPDATE), validateRequest(updateDocumentsSchema), controller.update);
router.delete('/:id', requirePermission(DOCUMENTS_PERMISSIONS.DELETE), controller.remove);

export const documentsRoutes = router;
