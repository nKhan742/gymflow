import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMealLibraryRepository, MealLibraryRepository } from '../repository/meal-library.repository.js';
import { CreateMealLibraryDto, UpdateMealLibraryDto } from '../dto/index.js';
import { MealLibraryMapper } from '../mapper/meal-library.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MealLibraryService extends BaseService {
  constructor(private readonly repo: IMealLibraryRepository = new MealLibraryRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMealLibraryDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MealLibraryMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('MealLibrary record not found');
    return MealLibraryMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MealLibraryMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMealLibraryDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('MealLibrary record not found');
    return MealLibraryMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('MealLibrary record not found');
    return true;
  }
}
