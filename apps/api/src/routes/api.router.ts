import { Router } from 'express';
import { authMiddleware } from '../core/middleware/auth.middleware.js';
import { tenantMiddleware } from '../core/middleware/tenant.middleware.js';

import { authDomainRoutes } from '../domains/auth/routes.js';
import { dashboardDomainRoutes } from '../domains/dashboard/routes.js';
import { administrationDomainRoutes } from '../domains/administration/routes.js';
import { gymDomainRoutes } from '../domains/gym/routes.js';
import { membersDomainRoutes } from '../domains/members/routes.js';
import { fitnessDomainRoutes } from '../domains/fitness/routes.js';
import { nutritionDomainRoutes } from '../domains/nutrition/routes.js';
import { crmDomainRoutes } from '../domains/crm/routes.js';
import { financeDomainRoutes } from '../domains/finance/routes.js';
import { inventoryDomainRoutes } from '../domains/inventory/routes.js';
import { equipmentDomainRoutes } from '../domains/equipment/routes.js';
import { schedulingDomainRoutes } from '../domains/scheduling/routes.js';
import { communicationDomainRoutes } from '../domains/communication/routes.js';
import { reportsDomainRoutes } from '../domains/reports/routes.js';
import { analyticsDomainRoutes } from '../domains/analytics/routes.js';
import { profileDomainRoutes } from '../domains/profile/routes.js';
import { platformDomainRoutes } from '../domains/platform/routes.js';

import mongoose from 'mongoose';
import { DatabaseConnection } from '../database/connection.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      readyState: dbState,
      host: mongoose.connection.host || null,
      error: DatabaseConnection.lastError,
    },
  });
});

apiRouter.get('/health/db-test', async (_req, res) => {
  try {
    await DatabaseConnection.connect();
    res.json({
      success: true,
      message: 'Connected to MongoDB Atlas!',
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || String(err),
      name: err?.name,
      reason: err?.reason?.message || null,
    });
  }
});

// Public Authentication Routes
apiRouter.use('/auth', authDomainRoutes);

// Platform Super Admin Control Plane Routes
apiRouter.use('/platform', platformDomainRoutes);

// Protected Domain Routes
apiRouter.use(authMiddleware);
apiRouter.use(tenantMiddleware);

apiRouter.use('/dashboard', dashboardDomainRoutes);
apiRouter.use('/administration', administrationDomainRoutes);
apiRouter.use('/gym', gymDomainRoutes);
apiRouter.use('/gym-management', gymDomainRoutes);
apiRouter.use('/members', membersDomainRoutes);
apiRouter.use('/member-management', membersDomainRoutes);
apiRouter.use('/fitness', fitnessDomainRoutes);
apiRouter.use('/nutrition', nutritionDomainRoutes);
apiRouter.use('/crm', crmDomainRoutes);
apiRouter.use('/finance', financeDomainRoutes);
apiRouter.use('/inventory', inventoryDomainRoutes);
apiRouter.use('/equipment', equipmentDomainRoutes);
apiRouter.use('/scheduling', schedulingDomainRoutes);
apiRouter.use('/communication', communicationDomainRoutes);
apiRouter.use('/reports', reportsDomainRoutes);
apiRouter.use('/analytics', analyticsDomainRoutes);
apiRouter.use('/profile', profileDomainRoutes);
