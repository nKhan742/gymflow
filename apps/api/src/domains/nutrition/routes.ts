import { Router } from 'express';
import { mealLibraryRoutes } from './meal-library/routes/index.js';
import { dietPlansRoutes } from './diet-plans/routes/index.js';
import { nutritionTrackingRoutes } from './nutrition-tracking/routes/index.js';
import { waterIntakeRoutes } from './water-intake/routes/index.js';

const router = Router();

router.use('/meal-library', mealLibraryRoutes);
router.use('/diet-plans', dietPlansRoutes);
router.use('/nutrition-tracking', nutritionTrackingRoutes);
router.use('/water-intake', waterIntakeRoutes);

export const nutritionDomainRoutes = router;
