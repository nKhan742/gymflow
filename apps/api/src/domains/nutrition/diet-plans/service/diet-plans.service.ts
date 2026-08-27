import { BaseService } from '../../../../shared/base/BaseService.js';
import { IDietPlansRepository, DietPlansRepository } from '../repository/diet-plans.repository.js';
import { CreateDietPlansDto, UpdateDietPlansDto } from '../dto/index.js';
import { DietPlansMapper } from '../mapper/diet-plans.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class DietPlansService extends BaseService {
  constructor(private readonly repo: IDietPlansRepository = new DietPlansRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateDietPlansDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return DietPlansMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('DietPlans record not found');
    return DietPlansMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(DietPlansMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateDietPlansDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('DietPlans record not found');
    return DietPlansMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('DietPlans record not found');
    return true;
  }
}
