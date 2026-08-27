import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMaintenanceRepository, MaintenanceRepository } from '../repository/maintenance.repository.js';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from '../dto/index.js';
import { MaintenanceMapper } from '../mapper/maintenance.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MaintenanceService extends BaseService {
  constructor(private readonly repo: IMaintenanceRepository = new MaintenanceRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMaintenanceDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MaintenanceMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Maintenance record not found');
    return MaintenanceMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MaintenanceMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMaintenanceDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Maintenance record not found');
    return MaintenanceMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Maintenance record not found');
    return true;
  }
}
