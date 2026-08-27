import { Router } from 'express';
import { usersRoutes } from './users/routes/index.js';
import { rolesRoutes } from './roles/routes/index.js';
import { permissionsRoutes } from './permissions/routes/index.js';
import { settingsRoutes } from './settings/routes/index.js';
import { activityLogsRoutes } from './activity-logs/routes/index.js';
import { auditLogsRoutes } from './audit-logs/routes/index.js';
import { featureFlagsRoutes } from './feature-flags/routes/index.js';

const router = Router();

router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/settings', settingsRoutes);
router.use('/activity-logs', activityLogsRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use('/feature-flags', featureFlagsRoutes);

export const administrationDomainRoutes = router;
