import { BaseService } from '../../../../shared/base/BaseService.js';
import { IProductsRepository, ProductsRepository } from '../repository/products.repository.js';
import { CreateProductsDto, UpdateProductsDto } from '../dto/index.js';
import { ProductsMapper } from '../mapper/products.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ProductsService extends BaseService {
  constructor(private readonly repo: IProductsRepository = new ProductsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateProductsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ProductsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Products record not found');
    return ProductsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ProductsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateProductsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Products record not found');
    return ProductsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Products record not found');
    return true;
  }
}
