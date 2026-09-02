import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { TenantDatabaseManager } from '../../../database/tenant-database.manager.js';
import { UsersModel } from '../../administration/users/model/users.model.js';

export class PlatformController {
  static async getTenants(_req: Request, res: Response) {
    try {
      const tenants: any[] = [];
      const processedDbs = new Set<string>();

      // 1. Inspect all tenant databases on the MongoDB cluster
      const dbNames = await TenantDatabaseManager.listTenantDatabases();

      for (const dbName of dbNames) {
        try {
          processedDbs.add(dbName);
          const models = TenantDatabaseManager.getTenantModels(dbName);

          const profile: any = await models.GymProfile.findOne().lean();
          const adminUser = await models.Users.findOne({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } }).lean();
          const branchCount = await models.Branches.countDocuments();
          const memberCount = await models.Members.countDocuments();
          const staffCount = await models.Staff.countDocuments();

          const cleanGymName = profile?.name || dbName.replace(/^gymflow_db_/, '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          const email = adminUser?.email || profile?.contacts?.email || '';
          const ownerName = adminUser ? (adminUser.name || `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim()) : 'Gym Owner';

          tenants.push({
            id: `TNT-${dbName.slice(-4).toUpperCase()}`,
            gymName: cleanGymName,
            campusName: profile?.branches?.[0]?.name || profile?.address?.city || 'Main Campus',
            ownerName,
            email,
            phone: adminUser?.phone || profile?.contacts?.phone || '',
            password: 'password123',
            planTier: profile?.subscriptionPlan || 'ESSENTIAL',
            billingCycle: 'MONTHLY',
            subscriptionStatus: profile?.status === 'inactive' || profile?.status === 'archived' ? 'SUSPENDED' : profile?.status === 'pending' ? 'PAUSED' : 'ACTIVE',
            memberCount: memberCount || 0,
            staffCount: staffCount || 1,
            branchCount: branchCount || 1,
            monthlyFee: 1500,
            joinedDate: profile?.createdAt ? new Date(profile.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            databaseName: dbName,
          });
        } catch (err) {
          console.warn(`[PlatformController] Error reading tenant db ${dbName}:`, err);
        }
      }

      // 2. Also check primary DB UsersModel for registered facility admins
      const primaryAdmins = await UsersModel.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] }, isDeleted: false }).lean();

      for (const admin of primaryAdmins) {
        if (admin.email === 'platform@gymflow.io' || admin.email === 'admin@gymflow.io') continue;
        const tenantId = admin.tenantId || '';
        const candidateDb = tenantId.startsWith('tenant_') ? tenantId.replace(/^tenant_/, 'gymflow_db_') : tenantId;
        if (candidateDb && processedDbs.has(candidateDb)) continue;

        tenants.push({
          id: `TNT-${String(admin._id).slice(-4).toUpperCase()}`,
          gymName: admin.name ? `${admin.name}'s Gym` : 'Registered Facility',
          campusName: 'Main Campus',
          ownerName: admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Gym Owner',
          email: admin.email,
          phone: admin.phone || '',
          password: 'password123',
          planTier: 'ESSENTIAL',
          billingCycle: 'MONTHLY',
          subscriptionStatus: admin.status === 'suspended' ? 'SUSPENDED' : 'ACTIVE',
          memberCount: 0,
          staffCount: 1,
          branchCount: 1,
          monthlyFee: 1500,
          joinedDate: admin.createdAt ? new Date(admin.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          databaseName: candidateDb || 'gymflow_db_tenant',
        });
      }

      return res.status(200).json({
        success: true,
        data: tenants,
        meta: {
          total: tenants.length,
          timestamp: new Date().toISOString(),
          cluster: mongoose.connection.host || 'MongoDB Atlas',
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch platform tenants from MongoDB Atlas',
        error: err?.message,
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { dbName } = req.params;
      const { status } = req.body;

      if (dbName && dbName.startsWith('gymflow_db_')) {
        const models = TenantDatabaseManager.getTenantModels(dbName);
        const mappedStatus = status === 'SUSPENDED' ? 'inactive' : status === 'PAUSED' ? 'pending' : 'active';
        await models.GymProfile.updateOne({}, { $set: { status: mappedStatus } }).exec();
      }

      return res.status(200).json({
        success: true,
        message: `Tenant subscription status updated to ${status}`,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update tenant status',
        error: err?.message,
      });
    }
  }
}
