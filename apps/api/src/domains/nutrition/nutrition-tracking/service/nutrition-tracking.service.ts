import { BaseService } from '../../../../shared/base/BaseService.js';
import { INutritionTrackingRepository, NutritionTrackingRepository } from '../repository/nutrition-tracking.repository.js';
import { CreateNutritionTrackingDto, UpdateNutritionTrackingDto } from '../dto/index.js';
import { NutritionTrackingMapper } from '../mapper/nutrition-tracking.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class NutritionTrackingService extends BaseService {
  constructor(private readonly repo: INutritionTrackingRepository = new NutritionTrackingRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateNutritionTrackingDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return NutritionTrackingMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('NutritionTracking record not found');
    return NutritionTrackingMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(NutritionTrackingMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateNutritionTrackingDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('NutritionTracking record not found');
    return NutritionTrackingMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('NutritionTracking record not found');
    return true;
  }
}
