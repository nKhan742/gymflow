import { BaseService } from '../../../../shared/base/BaseService.js';
import { IInventoryRepository, InventoryRepository } from '../repository/inventory.repository.js';
import { CreateInventoryDto, UpdateInventoryDto } from '../dto/index.js';
import { InventoryMapper } from '../mapper/inventory.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class InventoryService extends BaseService {
  constructor(private readonly repo: IInventoryRepository = new InventoryRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateInventoryDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return InventoryMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Inventory record not found');
    return InventoryMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(InventoryMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateInventoryDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Inventory record not found');
    return InventoryMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Inventory record not found');
    return true;
  }
}
