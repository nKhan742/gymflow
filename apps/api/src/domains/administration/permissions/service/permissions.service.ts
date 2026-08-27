import { BaseService } from '../../../../shared/base/BaseService.js';
import { IPermissionsRepository, PermissionsRepository } from '../repository/permissions.repository.js';
import { CreatePermissionsDto, UpdatePermissionsDto } from '../dto/index.js';
import { PermissionsMapper } from '../mapper/permissions.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class PermissionsService extends BaseService {
  constructor(private readonly repo: IPermissionsRepository = new PermissionsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreatePermissionsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return PermissionsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Permissions record not found');
    return PermissionsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(PermissionsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdatePermissionsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Permissions record not found');
    return PermissionsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Permissions record not found');
    return true;
  }
}
