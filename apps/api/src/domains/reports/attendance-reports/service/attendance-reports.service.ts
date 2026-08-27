import { BaseService } from '../../../../shared/base/BaseService.js';
import { IAttendanceReportsRepository, AttendanceReportsRepository } from '../repository/attendance-reports.repository.js';
import { CreateAttendanceReportsDto, UpdateAttendanceReportsDto } from '../dto/index.js';
import { AttendanceReportsMapper } from '../mapper/attendance-reports.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class AttendanceReportsService extends BaseService {
  constructor(private readonly repo: IAttendanceReportsRepository = new AttendanceReportsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateAttendanceReportsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return AttendanceReportsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('AttendanceReports record not found');
    return AttendanceReportsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(AttendanceReportsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateAttendanceReportsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('AttendanceReports record not found');
    return AttendanceReportsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('AttendanceReports record not found');
    return true;
  }
}
