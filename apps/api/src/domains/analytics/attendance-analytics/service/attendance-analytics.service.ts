import { BaseService } from '../../../../shared/base/BaseService.js';
import { IAttendanceAnalyticsRepository, AttendanceAnalyticsRepository } from '../repository/attendance-analytics.repository.js';
import { CreateAttendanceAnalyticsDto, UpdateAttendanceAnalyticsDto } from '../dto/index.js';
import { AttendanceAnalyticsMapper } from '../mapper/attendance-analytics.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class AttendanceAnalyticsService extends BaseService {
  constructor(private readonly repo: IAttendanceAnalyticsRepository = new AttendanceAnalyticsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateAttendanceAnalyticsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return AttendanceAnalyticsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('AttendanceAnalytics record not found');
    return AttendanceAnalyticsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(AttendanceAnalyticsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateAttendanceAnalyticsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('AttendanceAnalytics record not found');
    return AttendanceAnalyticsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('AttendanceAnalytics record not found');
    return true;
  }
}
