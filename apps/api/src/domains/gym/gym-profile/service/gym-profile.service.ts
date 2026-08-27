import { BaseService } from '../../../../shared/base/BaseService.js';
import { IGymProfileRepository, GymProfileRepository } from '../repository/gym-profile.repository.js';
import { CreateGymProfileDto, UpdateGymProfileDto } from '../dto/index.js';
import { GymProfileMapper } from '../mapper/gym-profile.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class GymProfileService extends BaseService {
  constructor(private readonly repo: IGymProfileRepository = new GymProfileRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateGymProfileDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return GymProfileMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('GymProfile record not found');
    return GymProfileMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(GymProfileMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateGymProfileDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('GymProfile record not found');
    return GymProfileMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('GymProfile record not found');
    return true;
  }
}
