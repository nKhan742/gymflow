import { BaseService } from '../../../../shared/base/BaseService.js';
import { ITransformationRepository, TransformationRepository } from '../repository/transformation.repository.js';
import { CreateTransformationDto, UpdateTransformationDto } from '../dto/index.js';
import { TransformationMapper } from '../mapper/transformation.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class TransformationService extends BaseService {
  constructor(private readonly repo: ITransformationRepository = new TransformationRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateTransformationDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return TransformationMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Transformation record not found');
    return TransformationMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(TransformationMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateTransformationDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Transformation record not found');
    return TransformationMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Transformation record not found');
    return true;
  }
}
