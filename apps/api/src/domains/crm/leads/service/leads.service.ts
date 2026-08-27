import { BaseService } from '../../../../shared/base/BaseService.js';
import { ILeadsRepository, LeadsRepository } from '../repository/leads.repository.js';
import { CreateLeadsDto, UpdateLeadsDto } from '../dto/index.js';
import { LeadsMapper } from '../mapper/leads.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class LeadsService extends BaseService {
  constructor(private readonly repo: ILeadsRepository = new LeadsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateLeadsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return LeadsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Leads record not found');
    return LeadsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(LeadsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateLeadsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Leads record not found');
    return LeadsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Leads record not found');
    return true;
  }
}
