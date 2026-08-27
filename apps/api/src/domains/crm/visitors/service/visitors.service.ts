import { BaseService } from '../../../../shared/base/BaseService.js';
import { IVisitorsRepository, VisitorsRepository } from '../repository/visitors.repository.js';
import { CreateVisitorsDto, UpdateVisitorsDto } from '../dto/index.js';
import { VisitorsMapper } from '../mapper/visitors.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class VisitorsService extends BaseService {
  constructor(private readonly repo: IVisitorsRepository = new VisitorsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateVisitorsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return VisitorsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Visitors record not found');
    return VisitorsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(VisitorsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateVisitorsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Visitors record not found');
    return VisitorsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Visitors record not found');
    return true;
  }
}
