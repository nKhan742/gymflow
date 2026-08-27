import { Router } from 'express';
import { exerciseCategoriesRoutes } from './exercise-categories/routes/index.js';
import { exerciseLibraryRoutes } from './exercise-library/routes/index.js';
import { workoutTemplatesRoutes } from './workout-templates/routes/index.js';
import { workoutPlansRoutes } from './workout-plans/routes/index.js';
import { workoutAssignmentRoutes } from './workout-assignment/routes/index.js';
import { fitnessAssessmentRoutes } from './fitness-assessment/routes/index.js';
import { personalTrainingRoutes } from './personal-training/routes/index.js';
import { groupClassesRoutes } from './group-classes/routes/index.js';
import { bookingsRoutes } from './bookings/routes/index.js';

const router = Router();

router.use('/exercise-categories', exerciseCategoriesRoutes);
router.use('/exercise-library', exerciseLibraryRoutes);
router.use('/workout-templates', workoutTemplatesRoutes);
router.use('/workout-plans', workoutPlansRoutes);
router.use('/workout-assignment', workoutAssignmentRoutes);
router.use('/fitness-assessment', fitnessAssessmentRoutes);
router.use('/personal-training', personalTrainingRoutes);
router.use('/group-classes', groupClassesRoutes);
router.use('/bookings', bookingsRoutes);

export const fitnessDomainRoutes = router;
