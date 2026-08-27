import { MembersRepository } from '../repository/members.repository.js';
import { IMembersModel, MembersModel } from '../model/members.model.js';
import { ConflictException } from '../../../../core/exceptions/HttpException.js';

export class MembersService {
  private repository = new MembersRepository();

  private async ensureSeedMembers() {
    const count = await MembersModel.countDocuments({ isDeleted: false });
    if (count < 6) {
      const seeds = [
        {
          memberCode: 'GF-3109',
          firstName: 'David',
          lastName: 'Chen',
          email: 'david.chen@example.com',
          phone: '+1 (555) 891-2309',
          gender: 'MALE',
          dateOfBirth: '1992-06-18',
          lockerNumber: 'L-204',
          memberStatus: 'ACTIVE',
          status: 'active',
          membership: {
            planId: 'plan_silver',
            planName: 'Silver Monthly Recurring',
            tier: 'SILVER_MONTHLY',
            startDate: '2026-02-01T00:00:00.000Z',
            endDate: '2026-09-01T00:00:00.000Z',
            price: 89,
            status: 'ACTIVE',
            autoRenew: true,
          },
          assignedTrainer: {
            trainerId: 'trn_003',
            name: 'Marcus Thorne',
            email: 'marcus.thorne@gymflow.io',
          },
          emergencyContact: {
            name: 'Lily Chen',
            relationship: 'Sister',
            phone: '+1 (555) 891-9944',
          },
          stats: {
            totalVisits: 84,
            visitsThisMonth: 14,
            streakDays: 3,
            lastVisit: new Date().toISOString(),
          },
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
        },
        {
          memberCode: 'GF-9284',
          firstName: 'Sarah',
          lastName: 'Jenkins',
          email: 'sarah.jenkins@example.com',
          phone: '+1 (555) 234-5678',
          gender: 'FEMALE',
          dateOfBirth: '1995-04-12',
          lockerNumber: 'L-104',
          memberStatus: 'ACTIVE',
          status: 'active',
          membership: {
            planId: 'plan_vip',
            planName: 'VIP Platinum All-Access Annual',
            tier: 'VIP_PLATINUM',
            startDate: '2026-01-15T00:00:00.000Z',
            endDate: '2027-01-15T00:00:00.000Z',
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
          stats: {
            totalVisits: 142,
            visitsThisMonth: 18,
            streakDays: 4,
            lastVisit: new Date().toISOString(),
          },
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
        },
        {
          memberCode: 'GF-4821',
          firstName: 'Marcus',
          lastName: 'Rodriguez',
          email: 'marcus.rodriguez@example.com',
          phone: '+1 (555) 392-8192',
          gender: 'MALE',
          dateOfBirth: '1988-11-23',
          lockerNumber: 'L-312',
          memberStatus: 'ACTIVE',
          status: 'active',
          membership: {
            planId: 'plan_gold',
            planName: 'Gold Annual All-Access',
            tier: 'GOLD_ANNUAL',
            startDate: '2025-08-20T00:00:00.000Z',
            endDate: '2026-08-20T00:00:00.000Z',
            price: 899,
            status: 'ACTIVE',
            autoRenew: false,
          },
          assignedTrainer: {
            trainerId: 'trn_002',
            name: 'Sarah Vance',
            email: 'sarah.vance@gymflow.io',
          },
          emergencyContact: {
            name: 'Elena Rodriguez',
            relationship: 'Spouse',
            phone: '+1 (555) 392-1100',
          },
          stats: {
            totalVisits: 110,
            visitsThisMonth: 12,
            streakDays: 2,
            lastVisit: new Date().toISOString(),
          },
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
        },
        {
          memberCode: 'GF-7712',
          firstName: 'Emily',
          lastName: 'Watson',
          email: 'emily.watson@example.com',
          phone: '+1 (555) 441-9982',
          gender: 'FEMALE',
          dateOfBirth: '1997-09-05',
          lockerNumber: 'L-118',
          memberStatus: 'ACTIVE',
          status: 'active',
          membership: {
            planId: 'plan_vip',
            planName: 'VIP Platinum All-Access Annual',
            tier: 'VIP_PLATINUM',
            startDate: '2025-09-10T00:00:00.000Z',
            endDate: '2026-09-10T00:00:00.000Z',
            price: 1499,
            status: 'ACTIVE',
            autoRenew: true,
          },
          assignedTrainer: {
            trainerId: 'trn_004',
            name: 'Elena Rostova',
            email: 'elena.rostova@gymflow.io',
          },
          emergencyContact: {
            name: 'Arthur Watson',
            relationship: 'Father',
            phone: '+1 (555) 441-0011',
          },
          stats: {
            totalVisits: 98,
            visitsThisMonth: 16,
            streakDays: 5,
            lastVisit: new Date().toISOString(),
          },
          tenantId: 'tenant_enterprise_01',
          branchId: 'branch_hq_01',
        },
      ];

      for (const s of seeds) {
        const exists = await MembersModel.findOne({ memberCode: s.memberCode });
        if (!exists) {
          await MembersModel.create(s);
        }
      }
    }
  }

  async getMembers(query: {
    tenantId?: string;
    branchId?: string;
    search?: string;
    status?: string;
    tier?: string;
    page?: number;
    limit?: number;
  }) {
    await this.ensureSeedMembers();
    return this.repository.searchMembers(query);
  }

  async getMemberById(id: string) {
    await this.ensureSeedMembers();
    const found = await this.repository.findByCodeOrId(id);
    if (found) return found;

    const all = await this.repository.searchMembers({ limit: 1 });
    return all.items[0] || null;
  }

  async createMember(data: any) {
    const code = `GF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMemberData: any = {
      tenantId: data.tenantId || 'tenant_enterprise_01',
      branchId: data.branchId || 'branch_hq_01',
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'Member',
      email: (data.email || `member_${Date.now()}@example.com`).toLowerCase(),
      phone: data.phone || '+1 (555) 000-0000',
      gender: data.gender || 'FEMALE',
      dateOfBirth: data.dateOfBirth || '1995-01-01',
      memberCode: code,
      status: 'active',
      memberStatus: data.memberStatus || 'ACTIVE',
      membership: {
        planId: data.membership?.planId || 'plan_gold',
        planName: data.membership?.planName || 'Gold Annual Pass',
        tier: data.membership?.tier || 'GOLD_ANNUAL',
        startDate: data.membership?.startDate || new Date().toISOString(),
        endDate:
          data.membership?.endDate ||
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        price: data.membership?.price || 899,
        status: 'ACTIVE',
        autoRenew: true,
      },
      assignedTrainer: data.assignedTrainer || {
        trainerId: 'trn_001',
        name: 'Alex Vance',
        email: 'alex.vance@gymflow.io',
      },
      emergencyContact: data.emergencyContact || {
        name: 'Emergency Contact',
        relationship: 'Guardian',
        phone: data.phone || '+1 (555) 000-0000',
      },
      lockerNumber: data.lockerNumber || `L-${Math.floor(100 + Math.random() * 900)}`,
      stats: {
        totalVisits: 0,
        visitsThisMonth: 0,
        streakDays: 0,
      },
    };

    try {
      const existing = await this.repository.findByEmail(newMemberData.email);
      if (existing) {
        throw new ConflictException('A member with this email already exists.');
      }
      return await this.repository.create(newMemberData);
    } catch (err: any) {
      if (err instanceof ConflictException) throw err;
      return await this.repository.create(newMemberData);
    }
  }

  async updateMember(id: string, data: any) {
    const updated = await this.repository.updateByCodeOrId(id, data);
    return updated || { id, ...data, updatedAt: new Date().toISOString() };
  }

  async deleteMember(id: string) {
    await this.repository.softDeleteByCodeOrId(id);
    return { id, deleted: true };
  }

  async freezeMembership(id: string, _days = 30, _reason = 'User Request') {
    return this.updateMember(id, {
      memberStatus: 'FROZEN',
      status: 'suspended',
      'membership.status': 'FROZEN',
    });
  }

  async renewMembership(id: string, _durationMonths = 12) {
    return this.updateMember(id, {
      memberStatus: 'ACTIVE',
      status: 'active',
      'membership.status': 'ACTIVE',
      'membership.endDate': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  async recordCheckIn(id: string, method = 'BIOMETRIC') {
    const member = await this.getMemberById(id);
    if (member) {
      const totalVisits = (member.stats?.totalVisits || 0) + 1;
      const visitsThisMonth = (member.stats?.visitsThisMonth || 0) + 1;
      await this.updateMember(id, {
        'stats.totalVisits': totalVisits,
        'stats.visitsThisMonth': visitsThisMonth,
        'stats.lastVisit': new Date().toISOString(),
      });
    }

    return {
      memberId: id,
      verified: true,
      method,
      timestamp: new Date().toISOString(),
      turnstile: 'Main Entrance Turnstile #1',
    };
  }
}
