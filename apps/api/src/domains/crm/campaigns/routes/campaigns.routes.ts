import { Router } from 'express';
import { CampaignsController } from '../controller/campaigns.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createCampaignsSchema, updateCampaignsSchema } from '../validation/campaigns.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { CAMPAIGNS_PERMISSIONS } from '../permissions/campaigns.permissions.js';

const router = Router();
const controller = new CampaignsController();

router.get('/', requirePermission(CAMPAIGNS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(CAMPAIGNS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(CAMPAIGNS_PERMISSIONS.CREATE), validateRequest(createCampaignsSchema), controller.create);
router.put('/:id', requirePermission(CAMPAIGNS_PERMISSIONS.UPDATE), validateRequest(updateCampaignsSchema), controller.update);
router.delete('/:id', requirePermission(CAMPAIGNS_PERMISSIONS.DELETE), controller.remove);

export const campaignsRoutes = router;
