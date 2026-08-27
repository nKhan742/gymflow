import { BaseService } from '../../../../shared/base/BaseService.js';
import { IAppointmentsRepository, AppointmentsRepository } from '../repository/appointments.repository.js';
import { CreateAppointmentsDto, UpdateAppointmentsDto } from '../dto/index.js';
import { AppointmentsMapper } from '../mapper/appointments.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class AppointmentsService extends BaseService {
  constructor(private readonly repo: IAppointmentsRepository = new AppointmentsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateAppointmentsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return AppointmentsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Appointments record not found');
    return AppointmentsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(AppointmentsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateAppointmentsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Appointments record not found');
    return AppointmentsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Appointments record not found');
    return true;
  }
}
