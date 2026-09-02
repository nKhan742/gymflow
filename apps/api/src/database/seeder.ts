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
  } catch (err: any) {
    logger.warn(`[Seeder] Warning during platform admin seed: ${err?.message || err}`);
  }
}

export async function clearDatabase(): Promise<void> {
  await seedDatabase();
}


