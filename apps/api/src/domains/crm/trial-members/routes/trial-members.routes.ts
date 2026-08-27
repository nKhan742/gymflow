import { Router } from 'express';
import { TrialMembersController } from '../controller/trial-members.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createTrialMembersSchema, updateTrialMembersSchema } from '../validation/trial-members.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { TRIAL_MEMBERS_PERMISSIONS } from '../permissions/trial-members.permissions.js';

const router = Router();
const controller = new TrialMembersController();

router.get('/', requirePermission(TRIAL_MEMBERS_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(TRIAL_MEMBERS_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(TRIAL_MEMBERS_PERMISSIONS.CREATE), validateRequest(createTrialMembersSchema), controller.create);
router.put('/:id', requirePermission(TRIAL_MEMBERS_PERMISSIONS.UPDATE), validateRequest(updateTrialMembersSchema), controller.update);
router.delete('/:id', requirePermission(TRIAL_MEMBERS_PERMISSIONS.DELETE), controller.remove);

export const trialMembersRoutes = router;
