import { BaseService } from '../../../../shared/base/BaseService.js';
import { IFeatureFlagsRepository, FeatureFlagsRepository } from '../repository/feature-flags.repository.js';
import { CreateFeatureFlagsDto, UpdateFeatureFlagsDto } from '../dto/index.js';
import { FeatureFlagsMapper } from '../mapper/feature-flags.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class FeatureFlagsService extends BaseService {
  constructor(private readonly repo: IFeatureFlagsRepository = new FeatureFlagsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateFeatureFlagsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return FeatureFlagsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('FeatureFlags record not found');
    return FeatureFlagsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(FeatureFlagsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateFeatureFlagsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('FeatureFlags record not found');
    return FeatureFlagsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('FeatureFlags record not found');
    return true;
  }
}
