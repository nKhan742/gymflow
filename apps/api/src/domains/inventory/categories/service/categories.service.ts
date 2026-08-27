import { BaseService } from '../../../../shared/base/BaseService.js';
import { ICategoriesRepository, CategoriesRepository } from '../repository/categories.repository.js';
import { CreateCategoriesDto, UpdateCategoriesDto } from '../dto/index.js';
import { CategoriesMapper } from '../mapper/categories.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class CategoriesService extends BaseService {
  constructor(private readonly repo: ICategoriesRepository = new CategoriesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateCategoriesDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return CategoriesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Categories record not found');
    return CategoriesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(CategoriesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateCategoriesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Categories record not found');
    return CategoriesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Categories record not found');
    return true;
  }
}
