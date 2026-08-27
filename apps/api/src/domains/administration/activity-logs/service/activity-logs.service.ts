import { BaseService } from '../../../../shared/base/BaseService.js';
import { IActivityLogsRepository, ActivityLogsRepository } from '../repository/activity-logs.repository.js';
import { CreateActivityLogsDto, UpdateActivityLogsDto } from '../dto/index.js';
import { ActivityLogsMapper } from '../mapper/activity-logs.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ActivityLogsService extends BaseService {
  constructor(private readonly repo: IActivityLogsRepository = new ActivityLogsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateActivityLogsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ActivityLogsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('ActivityLogs record not found');
    return ActivityLogsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ActivityLogsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateActivityLogsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('ActivityLogs record not found');
    return ActivityLogsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('ActivityLogs record not found');
    return true;
  }
}
