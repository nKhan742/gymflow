import { Router } from 'express';
import { equipmentRoutes } from './equipment/routes/index.js';
import { maintenanceRoutes } from './maintenance/routes/index.js';
import { serviceHistoryRoutes } from './service-history/routes/index.js';

const router = Router();

router.use('/equipment', equipmentRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/service-history', serviceHistoryRoutes);

export const equipmentDomainRoutes = router;
