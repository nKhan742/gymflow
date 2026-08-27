import { BaseService } from '../../../../shared/base/BaseService.js';
import { ITrainerAnalyticsRepository, TrainerAnalyticsRepository } from '../repository/trainer-analytics.repository.js';
import { CreateTrainerAnalyticsDto, UpdateTrainerAnalyticsDto } from '../dto/index.js';
import { TrainerAnalyticsMapper } from '../mapper/trainer-analytics.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class TrainerAnalyticsService extends BaseService {
  constructor(private readonly repo: ITrainerAnalyticsRepository = new TrainerAnalyticsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateTrainerAnalyticsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return TrainerAnalyticsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('TrainerAnalytics record not found');
    return TrainerAnalyticsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(TrainerAnalyticsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateTrainerAnalyticsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('TrainerAnalytics record not found');
    return TrainerAnalyticsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('TrainerAnalytics record not found');
    return true;
  }
}
