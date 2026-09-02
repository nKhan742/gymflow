import { IMembersModel, MembersModel } from '../model/members.model.js';
import { ConflictException, NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { TenantDatabaseManager } from '../../../../database/tenant-database.manager.js';

export class MembersService {
  private getModel(tenantId?: string) {
    if (tenantId) {
      try {
        return TenantDatabaseManager.getTenantModels(tenantId).Members;
      } catch {
        return MembersModel;
      }
    }
    return MembersModel;
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
    const model = this.getModel(query.tenantId);
    const filter: any = { isDeleted: false };
    if (query.tenantId) {
      filter.tenantId = query.tenantId;
    }
    if (query.status && query.status !== 'ALL') {
      filter.memberStatus = query.status.toUpperCase();
    }
    if (query.tier && query.tier !== 'ALL') {
      filter['membership.tier'] = query.tier;
    }
    if (query.branchId && query.branchId !== 'ALL') {
      filter.branchId = query.branchId;
    }
    if (query.search) {
      const s = query.search.trim();
      filter.$or = [
        { firstName: { $regex: s, $options: 'i' } },
        { lastName: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
        { memberCode: { $regex: s, $options: 'i' } },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      model.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMemberById(id: string, tenantId?: string) {
    const model = this.getModel(tenantId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const filter: any = {
      isDeleted: false,
      $or: [{ memberCode: id }, ...(isObjectId ? [{ _id: id }] : [])],
    };
    if (tenantId) filter.tenantId = tenantId;
    const found = await model.findOne(filter).lean();
    if (!found) {
      throw new NotFoundException('Member not found');
    }
    return found;
  }

  async createMember(data: any, tenantId?: string) {
    const targetTenantId = tenantId || data.tenantId;
    const model = this.getModel(targetTenantId);
    const code = `GF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMemberData: any = {
      tenantId: targetTenantId,
      branchId: data.branchId || 'main',
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'Member',
      email: (data.email || `member_${Date.now()}@example.com`).toLowerCase().trim(),
      phone: data.phone || '+1 (555) 000-0000',
      gender: data.gender || 'FEMALE',
      dateOfBirth: data.dateOfBirth || '1995-01-01',
      avatar: data.avatar || '',
      memberCode: code,
      status: 'active',
      memberStatus: data.memberStatus || 'ACTIVE',
      membership: {
        planId: data.membership?.planId || 'plan_standard',
        planName: data.membership?.planName || 'Standard Membership',
        tier: data.membership?.tier || 'STANDARD',
        startDate: data.membership?.startDate || new Date().toISOString(),
        endDate: data.membership?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        price: data.membership?.price || 0,
        status: 'ACTIVE',
        autoRenew: true,
      },
      emergencyContact: data.emergencyContact || {
        name: 'Emergency Contact',
        relationship: 'Family',
        phone: data.phone || '',
      },
      lockerNumber: data.lockerNumber || '',
      stats: {
        totalVisits: 0,
        visitsThisMonth: 0,
        streakDays: 0,
      },
    };

    const existing = await model.findOne({ email: newMemberData.email, isDeleted: false });
    if (existing) {
      throw new ConflictException('A member with this email already exists.');
    }

    return await model.create(newMemberData);
  }

  async updateMember(id: string, data: any, tenantId?: string) {
    const model = this.getModel(tenantId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const filter: any = {
      isDeleted: false,
      $or: [{ memberCode: id }, ...(isObjectId ? [{ _id: id }] : [])],
    };
    if (tenantId) filter.tenantId = tenantId;
    return await model.findOneAndUpdate(filter, { $set: data }, { new: true }).lean();
  }

  async deleteMember(id: string, tenantId?: string) {
    const model = this.getModel(tenantId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const filter: any = {
      $or: [{ memberCode: id }, ...(isObjectId ? [{ _id: id }] : [])],
    };
    if (tenantId) filter.tenantId = tenantId;
    await model.findOneAndUpdate(filter, { $set: { isDeleted: true, status: 'inactive' } });
    return { id, deleted: true };
  }

  async freezeMembership(id: string, _days = 30, _reason = 'User Request', tenantId?: string) {
    return this.updateMember(
      id,
      {
        memberStatus: 'FROZEN',
        status: 'suspended',
        'membership.status': 'FROZEN',
      },
      tenantId
    );
  }

  async renewMembership(id: string, _durationMonths = 12, tenantId?: string) {
    return this.updateMember(
      id,
      {
        memberStatus: 'ACTIVE',
        status: 'active',
        'membership.status': 'ACTIVE',
        'membership.endDate': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      tenantId
    );
  }

  async recordCheckIn(id: string, method = 'BIOMETRIC', tenantId?: string) {
    const member = await this.getMemberById(id, tenantId);
    if (member) {
      const totalVisits = (member.stats?.totalVisits || 0) + 1;
      const visitsThisMonth = (member.stats?.visitsThisMonth || 0) + 1;
      await this.updateMember(
        id,
        {
          'stats.totalVisits': totalVisits,
          'stats.visitsThisMonth': visitsThisMonth,
          'stats.lastVisit': new Date().toISOString(),
        },
        tenantId
      );
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
