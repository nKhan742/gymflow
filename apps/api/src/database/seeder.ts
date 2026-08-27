import bcrypt from 'bcrypt';
import { UsersModel } from '../domains/administration/users/model/users.model.js';
import { MembersModel } from '../domains/members/members/model/members.model.js';
import { logger } from '../core/logger/winston.logger.js';

export async function seedDatabase(): Promise<void> {
  try {
    const userCount = await UsersModel.countDocuments();
    if (userCount === 0) {
      logger.info('[GymFlow Seeder] Seeding initial enterprise users into MongoDB...');
      const passwordHash = await bcrypt.hash('password123', 10);

      await UsersModel.create([
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          email: 'admin@gymflow.io',
          passwordHash,
          firstName: 'Alex',
          lastName: 'Vance',
          role: 'SUPER_ADMIN',
          permissions: ['*'],
          phone: '+1 (555) 100-2000',
          isActive: true,
          status: 'active',
        },
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          email: 'trainer@gymflow.io',
          passwordHash,
          firstName: 'Marcus',
          lastName: 'Brody',
          role: 'TRAINER',
          permissions: ['fitness:read', 'fitness:write', 'scheduling:read'],
          phone: '+1 (555) 100-3000',
          isActive: true,
          status: 'active',
        },
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          email: 'member@gymflow.io',
          passwordHash,
          firstName: 'Sarah',
          lastName: 'Jenkins',
          role: 'MEMBER',
          permissions: ['profile:read', 'scheduling:read'],
          phone: '+1 (555) 100-4000',
          isActive: true,
          status: 'active',
        },
      ]);
      logger.info('[GymFlow Seeder] Enterprise users seeded successfully.');
    }

    const memberCount = await MembersModel.countDocuments();
    if (memberCount === 0) {
      logger.info('[GymFlow Seeder] Seeding initial members into MongoDB...');
      await MembersModel.create([
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          memberCode: 'GF-9284',
          firstName: 'Sarah',
          lastName: 'Jenkins',
          email: 'sarah.jenkins@example.com',
          phone: '+1 (555) 392-4820',
          gender: 'FEMALE',
          dateOfBirth: '1994-06-12',
          status: 'active',
          memberStatus: 'ACTIVE',
          membership: {
            planId: 'plan_vip',
            planName: 'VIP Platinum All-Access',
            tier: 'VIP_PLATINUM',
            startDate: '2025-03-15T00:00:00.000Z',
            endDate: '2026-03-14T00:00:00.000Z',
            price: 1499,
            status: 'ACTIVE',
            autoRenew: true,
          },
          assignedTrainer: {
            trainerId: 'trn_001',
            name: 'Alex Vance',
            email: 'alex.vance@gymflow.io',
          },
          emergencyContact: {
            name: 'Robert Jenkins',
            relationship: 'Spouse',
            phone: '+1 (555) 839-2041',
          },
          lockerNumber: 'L-104',
          stats: {
            totalVisits: 142,
            visitsThisMonth: 18,
            lastVisit: new Date().toISOString(),
            streakDays: 4,
          },
        },
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          memberCode: 'GF-9285',
          firstName: 'Marcus',
          lastName: 'Brody',
          email: 'marcus.brody@example.com',
          phone: '+1 (555) 481-9022',
          gender: 'MALE',
          dateOfBirth: '1989-11-20',
          status: 'active',
          memberStatus: 'ACTIVE',
          membership: {
            planId: 'plan_gold',
            planName: 'Gold Annual Pass',
            tier: 'GOLD_ANNUAL',
            startDate: '2025-01-10T00:00:00.000Z',
            endDate: '2026-01-09T00:00:00.000Z',
            price: 899,
            status: 'ACTIVE',
            autoRenew: true,
          },
          assignedTrainer: {
            trainerId: 'trn_002',
            name: 'Elena Rostova',
            email: 'elena.r@gymflow.io',
          },
          emergencyContact: {
            name: 'Claire Brody',
            relationship: 'Sister',
            phone: '+1 (555) 481-9023',
          },
          lockerNumber: 'L-210',
          stats: {
            totalVisits: 88,
            visitsThisMonth: 12,
            lastVisit: new Date(Date.now() - 86400000).toISOString(),
            streakDays: 2,
          },
        },
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          memberCode: 'GF-9286',
          firstName: 'Elena',
          lastName: 'Rostova',
          email: 'elena.rostova@example.com',
          phone: '+1 (555) 772-1049',
          gender: 'FEMALE',
          dateOfBirth: '1996-03-08',
          status: 'active',
          memberStatus: 'ACTIVE',
          membership: {
            planId: 'plan_silver',
            planName: 'Silver Monthly Flex',
            tier: 'SILVER_MONTHLY',
            startDate: '2026-07-01T00:00:00.000Z',
            endDate: '2026-09-01T00:00:00.000Z',
            price: 89,
            status: 'ACTIVE',
            autoRenew: true,
          },
          emergencyContact: {
            name: 'Dmitri Rostov',
            relationship: 'Brother',
            phone: '+1 (555) 772-1050',
          },
          stats: {
            totalVisits: 45,
            visitsThisMonth: 9,
            lastVisit: new Date(Date.now() - 172800000).toISOString(),
            streakDays: 1,
          },
        },
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          memberCode: 'GF-9287',
          firstName: 'David',
          lastName: 'Kim',
          email: 'david.kim@example.com',
          phone: '+1 (555) 903-8821',
          gender: 'MALE',
          dateOfBirth: '1992-08-14',
          status: 'suspended',
          memberStatus: 'FROZEN',
          membership: {
            planId: 'plan_gold',
            planName: 'Gold Annual Pass',
            tier: 'GOLD_ANNUAL',
            startDate: '2025-05-01T00:00:00.000Z',
            endDate: '2026-05-01T00:00:00.000Z',
            price: 899,
            status: 'FROZEN',
            autoRenew: false,
          },
          emergencyContact: {
            name: 'Grace Kim',
            relationship: 'Mother',
            phone: '+1 (555) 903-8822',
          },
          stats: {
            totalVisits: 62,
            visitsThisMonth: 0,
            streakDays: 0,
          },
        },
        {
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
          memberCode: 'GF-9288',
          firstName: 'Jessica',
          lastName: 'Taylor',
          email: 'jessica.taylor@example.com',
          phone: '+1 (555) 234-9912',
          gender: 'FEMALE',
          dateOfBirth: '1998-12-04',
          status: 'inactive',
          memberStatus: 'EXPIRED',
          membership: {
            planId: 'plan_silver',
            planName: 'Silver Monthly Flex',
            tier: 'SILVER_MONTHLY',
            startDate: '2025-07-01T00:00:00.000Z',
            endDate: '2026-08-01T00:00:00.000Z',
            price: 89,
            status: 'EXPIRED',
            autoRenew: false,
          },
          stats: {
            totalVisits: 31,
            visitsThisMonth: 0,
            streakDays: 0,
          },
        },
      ]);
      logger.info('[GymFlow Seeder] Members seeded successfully into MongoDB.');
    }
  } catch (error: any) {
    logger.error(`[GymFlow Seeder] Database seeding error: ${error.message}`);
  }
}

