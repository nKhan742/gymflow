import { Router } from 'express';
import { FitnessAssessmentController } from '../controller/fitness-assessment.controller.js';
import { validateRequest } from '../../../../core/middleware/validation.middleware.js';
import { createFitnessAssessmentSchema, updateFitnessAssessmentSchema } from '../validation/fitness-assessment.validation.js';
import { requirePermission } from '../../../../core/rbac/rbac.middleware.js';
import { FITNESS_ASSESSMENT_PERMISSIONS } from '../permissions/fitness-assessment.permissions.js';

const router = Router();
const controller = new FitnessAssessmentController();

router.get('/', requirePermission(FITNESS_ASSESSMENT_PERMISSIONS.VIEW), controller.getAll);
router.get('/:id', requirePermission(FITNESS_ASSESSMENT_PERMISSIONS.VIEW), controller.getById);
router.post('/', requirePermission(FITNESS_ASSESSMENT_PERMISSIONS.CREATE), validateRequest(createFitnessAssessmentSchema), controller.create);
router.put('/:id', requirePermission(FITNESS_ASSESSMENT_PERMISSIONS.UPDATE), validateRequest(updateFitnessAssessmentSchema), controller.update);
router.delete('/:id', requirePermission(FITNESS_ASSESSMENT_PERMISSIONS.DELETE), controller.remove);

export const fitnessAssessmentRoutes = router;
