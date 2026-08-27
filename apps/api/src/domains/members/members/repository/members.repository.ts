import { BaseRepository } from '../../../../database/base.repository.js';
import { IMembersModel, MembersModel } from '../model/members.model.js';
import { Types } from 'mongoose';

export class MembersRepository extends BaseRepository<IMembersModel> {
  constructor() {
    super(MembersModel);
  }

  async findByCodeOrId(codeOrId: string): Promise<IMembersModel | null> {
    const isObjectId = Types.ObjectId.isValid(codeOrId);
    const filter: any = { isDeleted: false };
    if (isObjectId) {
      filter.$or = [{ _id: codeOrId }, { memberCode: codeOrId }];
    } else {
      filter.memberCode = codeOrId;
    }
    return this.model.findOne(filter).exec();
  }

  async findByEmail(email: string): Promise<IMembersModel | null> {
    return this.model.findOne({ email: email.toLowerCase(), isDeleted: false }).exec();
  }

  async searchMembers(query: {
    tenantId?: string;
    branchId?: string;
    search?: string;
    status?: string;
    tier?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: IMembersModel[]; total: number; page: number; pages: number }> {
    const filter: Record<string, any> = { isDeleted: false };

    if (query.tenantId) filter.tenantId = query.tenantId;
    if (query.branchId) filter.branchId = query.branchId;

    if (query.status && query.status !== 'ALL') {
      const s = query.status.toUpperCase();
      filter.$or = [
        { memberStatus: s },
        { status: query.status.toLowerCase() },
        { 'membership.status': s },
      ];
    }

    if (query.tier && query.tier !== 'ALL') {
      filter['membership.tier'] = query.tier;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { memberCode: searchRegex },
      ];
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 50));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    };
  }

  async updateByCodeOrId(codeOrId: string, update: any): Promise<IMembersModel | null> {
    const isObjectId = Types.ObjectId.isValid(codeOrId);
    const filter: any = { isDeleted: false };
    if (isObjectId) {
      filter.$or = [{ _id: codeOrId }, { memberCode: codeOrId }];
    } else {
      filter.memberCode = codeOrId;
    }
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async softDeleteByCodeOrId(codeOrId: string): Promise<boolean> {
    const isObjectId = Types.ObjectId.isValid(codeOrId);
    const filter: any = { isDeleted: false };
    if (isObjectId) {
      filter.$or = [{ _id: codeOrId }, { memberCode: codeOrId }];
    } else {
      filter.memberCode = codeOrId;
    }
    const res = await this.model.findOneAndUpdate(filter, { isDeleted: true, status: 'archived', memberStatus: 'EXPIRED' }).exec();
    return !!res;
  }
}
