import { RouteObject } from 'react-router-dom';
import { exerciseCategoriesRoutes } from './exercise-categories/routes';
import { exerciseLibraryRoutes } from './exercise-library/routes';
import { workoutTemplatesRoutes } from './workout-templates/routes';
import { workoutPlansRoutes } from './workout-plans/routes';
import { workoutAssignmentRoutes } from './workout-assignment/routes';
import { fitnessAssessmentRoutes } from './fitness-assessment/routes';
import { personalTrainingRoutes } from './personal-training/routes';
import { groupClassesRoutes } from './group-classes/routes';
import { classBookingRoutes } from './class-booking/routes';

export const fitnessRoutes: RouteObject[] = [
  ...exerciseCategoriesRoutes,
  ...exerciseLibraryRoutes,
  ...workoutTemplatesRoutes,
  ...workoutPlansRoutes,
  ...workoutAssignmentRoutes,
  ...fitnessAssessmentRoutes,
  ...personalTrainingRoutes,
  ...groupClassesRoutes,
  ...classBookingRoutes,
];
