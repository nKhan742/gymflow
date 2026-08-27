import { BaseService } from '../../../../shared/base/BaseService.js';
import { ITrainerCommissionRepository, TrainerCommissionRepository } from '../repository/trainer-commission.repository.js';
import { CreateTrainerCommissionDto, UpdateTrainerCommissionDto } from '../dto/index.js';
import { TrainerCommissionMapper } from '../mapper/trainer-commission.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class TrainerCommissionService extends BaseService {
  constructor(private readonly repo: ITrainerCommissionRepository = new TrainerCommissionRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateTrainerCommissionDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return TrainerCommissionMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('TrainerCommission record not found');
    return TrainerCommissionMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(TrainerCommissionMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateTrainerCommissionDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('TrainerCommission record not found');
    return TrainerCommissionMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('TrainerCommission record not found');
    return true;
  }
}
