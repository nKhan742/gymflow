import { BaseService } from '../../../../shared/base/BaseService.js';
import { IRolesRepository, RolesRepository } from '../repository/roles.repository.js';
import { CreateRolesDto, UpdateRolesDto } from '../dto/index.js';
import { RolesMapper } from '../mapper/roles.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class RolesService extends BaseService {
  constructor(private readonly repo: IRolesRepository = new RolesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateRolesDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return RolesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Roles record not found');
    return RolesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(RolesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateRolesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Roles record not found');
    return RolesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Roles record not found');
    return true;
  }
}
