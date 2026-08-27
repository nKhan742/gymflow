import { BaseService } from '../../../../shared/base/BaseService.js';
import { ICouponsRepository, CouponsRepository } from '../repository/coupons.repository.js';
import { CreateCouponsDto, UpdateCouponsDto } from '../dto/index.js';
import { CouponsMapper } from '../mapper/coupons.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class CouponsService extends BaseService {
  constructor(private readonly repo: ICouponsRepository = new CouponsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateCouponsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return CouponsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Coupons record not found');
    return CouponsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(CouponsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateCouponsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Coupons record not found');
    return CouponsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Coupons record not found');
    return true;
  }
}
