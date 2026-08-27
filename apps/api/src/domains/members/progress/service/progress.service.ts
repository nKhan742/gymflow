import { BaseService } from '../../../../shared/base/BaseService.js';
import { IProgressRepository, ProgressRepository } from '../repository/progress.repository.js';
import { CreateProgressDto, UpdateProgressDto } from '../dto/index.js';
import { ProgressMapper } from '../mapper/progress.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ProgressService extends BaseService {
  constructor(private readonly repo: IProgressRepository = new ProgressRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateProgressDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ProgressMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Progress record not found');
    return ProgressMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ProgressMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateProgressDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Progress record not found');
    return ProgressMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Progress record not found');
    return true;
  }
}
