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
    const { _id, id: _tempId, ...cleanDto } = dto as any;
    const existing = await this.repo.findOne({ tenantId });
    if (existing) {
      const updated = await this.repo.updateById(existing.id || (existing as any)._id, {
        ...cleanDto,
        updatedBy: createdBy,
      }, tenantId);
      return GymProfileMapper.toDTO(updated || existing);
    }

    const item = await this.repo.create({
      tenantId,
      ...cleanDto,
      createdBy,
    });
    return GymProfileMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    let item = await this.repo.findById(id, tenantId);
    if (!item && (id === 'default' || id === 'GF-MAIN')) {
      item = await this.repo.findOne({ tenantId });
    }
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
    const { _id, id: _tempId, ...cleanDto } = dto as any;
    let item = await this.repo.updateById(id, { ...cleanDto, updatedBy }, tenantId);
    if (!item) {
      const existing = await this.repo.findOne({ tenantId });
      if (existing) {
        item = await this.repo.updateById(existing.id || (existing as any)._id, { ...cleanDto, updatedBy }, tenantId);
      } else {
        item = await this.repo.create({
          tenantId,
          ...cleanDto,
          createdBy: updatedBy,
        });
      }
    }
    return GymProfileMapper.toDTO(item!);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('GymProfile record not found');
    return true;
  }
}
