import { BaseService } from '../../../../shared/base/BaseService.js';
import { IPurchasesRepository, PurchasesRepository } from '../repository/purchases.repository.js';
import { CreatePurchasesDto, UpdatePurchasesDto } from '../dto/index.js';
import { PurchasesMapper } from '../mapper/purchases.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class PurchasesService extends BaseService {
  constructor(private readonly repo: IPurchasesRepository = new PurchasesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreatePurchasesDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return PurchasesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Purchases record not found');
    return PurchasesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(PurchasesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdatePurchasesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Purchases record not found');
    return PurchasesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Purchases record not found');
    return true;
  }
}
