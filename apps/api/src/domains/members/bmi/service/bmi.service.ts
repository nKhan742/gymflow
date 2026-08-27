import { BaseService } from '../../../../shared/base/BaseService.js';
import { IBmiRepository, BmiRepository } from '../repository/bmi.repository.js';
import { CreateBmiDto, UpdateBmiDto } from '../dto/index.js';
import { BmiMapper } from '../mapper/bmi.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class BmiService extends BaseService {
  constructor(private readonly repo: IBmiRepository = new BmiRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateBmiDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return BmiMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Bmi record not found');
    return BmiMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(BmiMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateBmiDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Bmi record not found');
    return BmiMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Bmi record not found');
    return true;
  }
}
