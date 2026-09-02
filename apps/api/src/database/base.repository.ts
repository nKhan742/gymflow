import { Model, FilterQuery, UpdateQuery, Types } from 'mongoose';
import { IBaseModel } from './base.model.js';
import { TenantDatabaseManager } from './tenant-database.manager.js';

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBaseRepository<T extends IBaseModel> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string | Types.ObjectId, tenantId?: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter: FilterQuery<T>, pagination?: IPaginationOptions): Promise<IPaginatedResult<T>>;
  updateById(id: string | Types.ObjectId, update: UpdateQuery<T>, tenantId?: string): Promise<T | null>;
  softDelete(id: string | Types.ObjectId, deletedBy?: string, tenantId?: string): Promise<boolean>;
  hardDelete(id: string | Types.ObjectId, tenantId?: string): Promise<boolean>;
}

export abstract class BaseRepository<T extends IBaseModel> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  protected getModel(tenantId?: string): Model<T> {
    if (!tenantId || tenantId === 'tenant_enterprise_01' || tenantId === 'gymflow_erp') {
      return this.model;
    }
    try {
      const cleanDbName = tenantId.startsWith('tenant_gymflow_')
        ? tenantId.replace(/^tenant_/, '')
        : tenantId.startsWith('tenant_')
        ? `gymflow_db_${tenantId.replace(/^tenant_/, '')}`
        : tenantId;

      const tenantConn = TenantDatabaseManager.getTenantDb(cleanDbName);
      const modelName = this.model.modelName;
      if (tenantConn.models[modelName]) {
        return tenantConn.models[modelName] as Model<T>;
      }
      return tenantConn.model<T>(modelName, this.model.schema) as Model<T>;
    } catch {
      return this.model;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const activeModel = this.getModel((data as any)?.tenantId);
    return activeModel.create(data);
  }

  async findById(id: string | Types.ObjectId, tenantId?: string): Promise<T | null> {
    try {
      const activeModel = this.getModel(tenantId);
      const isObjectId = typeof id === 'string' ? Types.ObjectId.isValid(id) : true;
      const query: FilterQuery<T> = (isObjectId
        ? { _id: id, isDeleted: false }
        : { $or: [{ code: id }, { id: id }, { slug: id }], isDeleted: false }
      ) as FilterQuery<T>;
      if (tenantId) (query as any).tenantId = tenantId;
      const doc = await activeModel.findOne(query).exec();
      if (doc) return doc;

      if (typeof id === 'string' && isObjectId) {
        const codeQuery = { $or: [{ code: id }, { id: id }], isDeleted: false } as FilterQuery<T>;
        if (tenantId) (codeQuery as any).tenantId = tenantId;
        return await activeModel.findOne(codeQuery).exec();
      }
      return null;
    } catch {
      return null;
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    const tenantId = (filter as any)?.tenantId;
    const activeModel = this.getModel(tenantId);
    return activeModel.findOne({ ...filter, isDeleted: false }).exec();
  }

  async find(filter: FilterQuery<T>, pagination: IPaginationOptions = {}): Promise<IPaginatedResult<T>> {
    const page = Math.max(1, pagination.page || 1);
    const limit = Math.max(1, Math.min(100, pagination.limit || 10));
    const skip = (page - 1) * limit;
    const sortField = pagination.sortBy || 'createdAt';
    const sortDirection = pagination.sortOrder === 'asc' ? 1 : -1;

    const tenantId = (filter as any)?.tenantId;
    const activeModel = this.getModel(tenantId);
    const queryFilter = { ...filter, isDeleted: false };

    let [items, total] = await Promise.all([
      activeModel
        .find(queryFilter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      activeModel.countDocuments(queryFilter).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async updateById(id: string | Types.ObjectId, update: UpdateQuery<T>, tenantId?: string): Promise<T | null> {
    try {
      const activeModel = this.getModel(tenantId);
      const isObjectId = typeof id === 'string' ? Types.ObjectId.isValid(id) : true;
      const query: FilterQuery<T> = (isObjectId
        ? { _id: id, isDeleted: false }
        : { $or: [{ code: id }, { id: id }], isDeleted: false }
      ) as FilterQuery<T>;
      if (tenantId) (query as any).tenantId = tenantId;
      return await activeModel.findOneAndUpdate(query, update, { new: true }).exec();
    } catch {
      return null;
    }
  }

  async softDelete(id: string | Types.ObjectId, deletedBy?: string, tenantId?: string): Promise<boolean> {
    try {
      const activeModel = this.getModel(tenantId);
      const isObjectId = typeof id === 'string' ? Types.ObjectId.isValid(id) : true;
      const query: FilterQuery<T> = (isObjectId
        ? { _id: id, isDeleted: false }
        : { $or: [{ code: id }, { id: id }], isDeleted: false }
      ) as FilterQuery<T>;
      if (tenantId) (query as any).tenantId = tenantId;
      const res = await activeModel.findOneAndUpdate(query, { isDeleted: true, deletedBy, status: 'archived' }).exec();
      return !!res;
    } catch {
      return false;
    }
  }

  async hardDelete(id: string | Types.ObjectId, tenantId?: string): Promise<boolean> {
    try {
      const activeModel = this.getModel(tenantId);
      const isObjectId = typeof id === 'string' ? Types.ObjectId.isValid(id) : true;
      const query: FilterQuery<T> = (isObjectId
        ? { _id: id }
        : { $or: [{ code: id }, { id: id }] }
      ) as FilterQuery<T>;
      if (tenantId) (query as any).tenantId = tenantId;
      const res = await activeModel.deleteOne(query).exec();
      return (res.deletedCount || 0) > 0;
    } catch {
      return false;
    }
  }
}
