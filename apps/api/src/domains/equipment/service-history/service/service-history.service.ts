import { BaseService } from '../../../../shared/base/BaseService.js';
import { IServiceHistoryRepository, ServiceHistoryRepository } from '../repository/service-history.repository.js';
import { CreateServiceHistoryDto, UpdateServiceHistoryDto } from '../dto/index.js';
import { ServiceHistoryMapper } from '../mapper/service-history.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ServiceHistoryService extends BaseService {
  constructor(private readonly repo: IServiceHistoryRepository = new ServiceHistoryRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateServiceHistoryDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ServiceHistoryMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('ServiceHistory record not found');
    return ServiceHistoryMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ServiceHistoryMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateServiceHistoryDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('ServiceHistory record not found');
    return ServiceHistoryMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('ServiceHistory record not found');
    return true;
  }
}
