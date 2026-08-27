import { Router } from 'express';
import { membersRoutes } from './members/routes/index.js';
import { membershipPlansRoutes } from './membership-plans/routes/index.js';
import { membershipRenewalsRoutes } from './membership-renewals/routes/index.js';
import { attendanceRoutes } from './attendance/routes/index.js';
import { freezeMembershipRoutes } from './freeze-membership/routes/index.js';
import { bmiRoutes } from './bmi/routes/index.js';
import { bodyMeasurementsRoutes } from './body-measurements/routes/index.js';
import { progressRoutes } from './progress/routes/index.js';
import { transformationRoutes } from './transformation/routes/index.js';
import { medicalHistoryRoutes } from './medical-history/routes/index.js';
import { emergencyContactsRoutes } from './emergency-contacts/routes/index.js';
import { documentsRoutes } from './documents/routes/index.js';

const router = Router();

router.use('/members', membersRoutes);
router.use('/membership-plans', membershipPlansRoutes);
router.use('/membership-renewals', membershipRenewalsRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/freeze-membership', freezeMembershipRoutes);
router.use('/bmi', bmiRoutes);
router.use('/body-measurements', bodyMeasurementsRoutes);
router.use('/progress', progressRoutes);
router.use('/transformation', transformationRoutes);
router.use('/medical-history', medicalHistoryRoutes);
router.use('/emergency-contacts', emergencyContactsRoutes);
router.use('/documents', documentsRoutes);

export const membersDomainRoutes = router;
