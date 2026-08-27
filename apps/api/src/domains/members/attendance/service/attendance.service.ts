import { BaseService } from '../../../../shared/base/BaseService.js';
import { IAttendanceRepository, AttendanceRepository } from '../repository/attendance.repository.js';
import { CreateAttendanceDto, UpdateAttendanceDto } from '../dto/index.js';
import { AttendanceMapper } from '../mapper/attendance.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class AttendanceService extends BaseService {
  constructor(private readonly repo: IAttendanceRepository = new AttendanceRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateAttendanceDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return AttendanceMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Attendance record not found');
    return AttendanceMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(AttendanceMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateAttendanceDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Attendance record not found');
    return AttendanceMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Attendance record not found');
    return true;
  }
}
