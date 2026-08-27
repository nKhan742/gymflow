import { BaseService } from '../../../../shared/base/BaseService.js';
import { IInventoryReportsRepository, InventoryReportsRepository } from '../repository/inventory-reports.repository.js';
import { CreateInventoryReportsDto, UpdateInventoryReportsDto } from '../dto/index.js';
import { InventoryReportsMapper } from '../mapper/inventory-reports.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class InventoryReportsService extends BaseService {
  constructor(private readonly repo: IInventoryReportsRepository = new InventoryReportsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateInventoryReportsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return InventoryReportsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('InventoryReports record not found');
    return InventoryReportsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(InventoryReportsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateInventoryReportsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('InventoryReports record not found');
    return InventoryReportsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('InventoryReports record not found');
    return true;
  }
}
