import { BaseService } from '../../../../shared/base/BaseService.js';
import { IDiscountsRepository, DiscountsRepository } from '../repository/discounts.repository.js';
import { CreateDiscountsDto, UpdateDiscountsDto } from '../dto/index.js';
import { DiscountsMapper } from '../mapper/discounts.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class DiscountsService extends BaseService {
  constructor(private readonly repo: IDiscountsRepository = new DiscountsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateDiscountsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return DiscountsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Discounts record not found');
    return DiscountsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(DiscountsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateDiscountsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Discounts record not found');
    return DiscountsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Discounts record not found');
    return true;
  }
}
