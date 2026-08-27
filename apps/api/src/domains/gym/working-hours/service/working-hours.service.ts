import { BaseService } from '../../../../shared/base/BaseService.js';
import { IWorkingHoursRepository, WorkingHoursRepository } from '../repository/working-hours.repository.js';
import { CreateWorkingHoursDto, UpdateWorkingHoursDto } from '../dto/index.js';
import { WorkingHoursMapper } from '../mapper/working-hours.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class WorkingHoursService extends BaseService {
  constructor(private readonly repo: IWorkingHoursRepository = new WorkingHoursRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateWorkingHoursDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return WorkingHoursMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('WorkingHours record not found');
    return WorkingHoursMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(WorkingHoursMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateWorkingHoursDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('WorkingHours record not found');
    return WorkingHoursMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('WorkingHours record not found');
    return true;
  }
}
