import { Router } from 'express';
import { gymProfileRoutes } from './gym-profile/routes/index.js';
import { branchesRoutes } from './branches/routes/index.js';
import { departmentsRoutes } from './departments/routes/index.js';
import { staffRoutes } from './staff/routes/index.js';
import { shiftManagementRoutes } from './shift-management/routes/index.js';
import { workingHoursRoutes } from './working-hours/routes/index.js';
import { holidaysRoutes } from './holidays/routes/index.js';
import { facilitiesRoutes } from './facilities/routes/index.js';

const router = Router();

router.use('/facilities', facilitiesRoutes);
router.use('/gym-profile', gymProfileRoutes);
router.use('/branches', branchesRoutes);
router.use('/departments', departmentsRoutes);
router.use('/staff', staffRoutes);
router.use('/shift-management', shiftManagementRoutes);
router.use('/shifts', shiftManagementRoutes);
router.use('/working-hours', workingHoursRoutes);
router.use('/holidays', holidaysRoutes);

export const gymDomainRoutes = router;
