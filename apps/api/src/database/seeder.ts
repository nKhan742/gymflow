import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../core/logger/winston.logger.js';
import { UsersModel } from '../domains/administration/users/model/users.model.js';

export async function seedDatabase(): Promise<void> {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);

    // Seed Platform Super Administrator in Primary Database (gymflow_erp)
    await UsersModel.findOneAndUpdate(
      { email: 'platform@gymflow.io' },
      {
        tenantId: 'primary_platform',
        name: 'GymFlow Platform Owner',
        code: 'USR-PLATFORM-ROOT',
        email: 'platform@gymflow.io',
        passwordHash,
        firstName: 'Platform',
        lastName: 'Owner',
        role: 'SUPER_ADMIN',
        permissions: ['*'],
        branchId: 'branch_platform_hq',
        phone: '1800-GYM-FLOW',
        isActive: true,
        status: 'active',
      },
      { upsert: true, new: true }
    );

    // Also seed admin@gymflow.io in Primary Database
    await UsersModel.findOneAndUpdate(
      { email: 'admin@gymflow.io' },
      {
        tenantId: 'primary_platform',
        name: 'GymFlow System Administrator',
        code: 'USR-PLATFORM-002',
        email: 'admin@gymflow.io',
        passwordHash,
        firstName: 'System',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        permissions: ['*'],
        branchId: 'branch_platform_hq',
        phone: '1800-GYM-FLOW',
        isActive: true,
        status: 'active',
      },
      { upsert: true, new: true }
    );

    logger.info('[Seeder] Platform Super Admin seeded in primary DB: platform@gymflow.io / password123');

    // Also ensure all existing tenant databases have essential predefined roles, departments, shifts, holidays, fitness and nutrition
    try {
      const { TenantDatabaseManager } = await import('./tenant-database.manager.js');
      const { seedTenantDefaults } = await import('./tenant-seeder.js');
      const tenantDbs = await TenantDatabaseManager.listTenantDatabases();

      for (const dbName of tenantDbs) {
        try {
          const tenantModels = TenantDatabaseManager.getTenantModels(dbName);
          const rolesCount = await tenantModels.Roles.countDocuments();
          const deptCount = await tenantModels.Departments.countDocuments();
          const shiftsCount = await tenantModels.Shifts.countDocuments();
          const permissionsCount = await tenantModels.Permissions.countDocuments();
          const profile = await tenantModels.GymProfile.findOne();

          if (rolesCount === 0 || deptCount <= 2 || shiftsCount === 0 || permissionsCount === 0) {
            const branch = await tenantModels.Branches.findOne();
            const branchDoc = branch || { _id: 'BR-HQ', name: 'Main Campus' };
            const tenantId = profile?.tenantId || dbName.replace(/^gymflow_db_/, 'tenant_');
            await seedTenantDefaults(
              tenantModels,
              tenantId,
              branchDoc,
              Math.random().toString(36).substring(2, 7).toUpperCase(),
              profile?.currency || 'USD',
              profile?.name || 'GymFlow'
            );
          }
        } catch (dbErr: any) {
          logger.warn(`[Seeder] Notice for tenant DB ${dbName}: ${dbErr?.message || dbErr}`);
        }
      }
    } catch (backfillErr: any) {
      logger.warn(`[Seeder] Tenant backfill notice: ${backfillErr?.message || backfillErr}`);
    }
  } catch (err: any) {
    logger.warn(`[Seeder] Warning during platform admin seed: ${err?.message || err}`);
  }
}

export async function clearDatabase(): Promise<void> {
  await seedDatabase();
}


