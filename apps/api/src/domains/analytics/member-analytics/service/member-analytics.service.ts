import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMemberAnalyticsRepository, MemberAnalyticsRepository } from '../repository/member-analytics.repository.js';
import { CreateMemberAnalyticsDto, UpdateMemberAnalyticsDto } from '../dto/index.js';
import { MemberAnalyticsMapper } from '../mapper/member-analytics.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MemberAnalyticsService extends BaseService {
  constructor(private readonly repo: IMemberAnalyticsRepository = new MemberAnalyticsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMemberAnalyticsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MemberAnalyticsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('MemberAnalytics record not found');
    return MemberAnalyticsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MemberAnalyticsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMemberAnalyticsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('MemberAnalytics record not found');
    return MemberAnalyticsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('MemberAnalytics record not found');
    return true;
  }
}
