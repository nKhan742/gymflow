import { BaseService } from '../../../../shared/base/BaseService.js';
import { IFollowUpsRepository, FollowUpsRepository } from '../repository/follow-ups.repository.js';
import { CreateFollowUpsDto, UpdateFollowUpsDto } from '../dto/index.js';
import { FollowUpsMapper } from '../mapper/follow-ups.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class FollowUpsService extends BaseService {
  constructor(private readonly repo: IFollowUpsRepository = new FollowUpsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateFollowUpsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return FollowUpsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('FollowUps record not found');
    return FollowUpsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(FollowUpsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateFollowUpsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('FollowUps record not found');
    return FollowUpsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('FollowUps record not found');
    return true;
  }
}
