import { BaseService } from '../../../../shared/base/BaseService.js';
import { IGrowthAnalyticsRepository, GrowthAnalyticsRepository } from '../repository/growth-analytics.repository.js';
import { CreateGrowthAnalyticsDto, UpdateGrowthAnalyticsDto } from '../dto/index.js';
import { GrowthAnalyticsMapper } from '../mapper/growth-analytics.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class GrowthAnalyticsService extends BaseService {
  constructor(private readonly repo: IGrowthAnalyticsRepository = new GrowthAnalyticsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateGrowthAnalyticsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return GrowthAnalyticsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('GrowthAnalytics record not found');
    return GrowthAnalyticsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(GrowthAnalyticsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateGrowthAnalyticsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('GrowthAnalytics record not found');
    return GrowthAnalyticsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('GrowthAnalytics record not found');
    return true;
  }
}
