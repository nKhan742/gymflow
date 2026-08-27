import { RouteObject } from 'react-router-dom';
import { mealLibraryRoutes } from './meal-library/routes';
import { dietPlansRoutes } from './diet-plans/routes';
import { nutritionTrackingRoutes } from './nutrition-tracking/routes';
import { waterIntakeRoutes } from './water-intake/routes';

export const nutritionRoutes: RouteObject[] = [
  ...mealLibraryRoutes,
  ...dietPlansRoutes,
  ...nutritionTrackingRoutes,
  ...waterIntakeRoutes,
];
