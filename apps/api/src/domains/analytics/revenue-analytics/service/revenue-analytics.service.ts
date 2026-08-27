import { BaseService } from '../../../../shared/base/BaseService.js';
import { IRevenueAnalyticsRepository, RevenueAnalyticsRepository } from '../repository/revenue-analytics.repository.js';
import { CreateRevenueAnalyticsDto, UpdateRevenueAnalyticsDto } from '../dto/index.js';
import { RevenueAnalyticsMapper } from '../mapper/revenue-analytics.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class RevenueAnalyticsService extends BaseService {
  constructor(private readonly repo: IRevenueAnalyticsRepository = new RevenueAnalyticsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateRevenueAnalyticsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return RevenueAnalyticsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('RevenueAnalytics record not found');
    return RevenueAnalyticsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(RevenueAnalyticsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateRevenueAnalyticsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('RevenueAnalytics record not found');
    return RevenueAnalyticsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('RevenueAnalytics record not found');
    return true;
  }
}
