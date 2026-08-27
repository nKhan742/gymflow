import { Router } from 'express';
import { calendarRoutes } from './calendar/routes/index.js';
import { appointmentsRoutes } from './appointments/routes/index.js';
import { trainerScheduleRoutes } from './trainer-schedule/routes/index.js';
import { resourceBookingRoutes } from './resource-booking/routes/index.js';
import { classesRoutes } from './classes/routes/index.js';

const router = Router();

router.use('/classes', classesRoutes);
router.use('/calendar', calendarRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/trainer-schedule', trainerScheduleRoutes);
router.use('/resource-booking', resourceBookingRoutes);

export const schedulingDomainRoutes = router;
