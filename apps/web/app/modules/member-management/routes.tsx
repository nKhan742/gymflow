import { RouteObject } from 'react-router-dom';
import { membersRoutes } from './members/routes';
import { membershipPlansRoutes } from './membership-plans/routes';
import { membershipRenewalsRoutes } from './membership-renewals/routes';
import { attendanceRoutes } from './attendance/routes';
import { freezeMembershipRoutes } from './freeze-membership/routes';
import { bmiRoutes } from './bmi/routes';
import { bodyMeasurementsRoutes } from './body-measurements/routes';
import { progressRoutes } from './progress/routes';
import { transformationRoutes } from './transformation/routes';
import { medicalHistoryRoutes } from './medical-history/routes';
import { emergencyContactsRoutes } from './emergency-contacts/routes';
import { documentsRoutes } from './documents/routes';

export const memberManagementRoutes: RouteObject[] = [
  ...membersRoutes,
  ...membershipPlansRoutes,
  ...membershipRenewalsRoutes,
  ...attendanceRoutes,
  ...freezeMembershipRoutes,
  ...bmiRoutes,
  ...bodyMeasurementsRoutes,
  ...progressRoutes,
  ...transformationRoutes,
  ...medicalHistoryRoutes,
  ...emergencyContactsRoutes,
  ...documentsRoutes,
];
