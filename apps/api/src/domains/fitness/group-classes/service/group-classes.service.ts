import { BaseService } from '../../../../shared/base/BaseService.js';
import { IGroupClassesRepository, GroupClassesRepository } from '../repository/group-classes.repository.js';
import { CreateGroupClassesDto, UpdateGroupClassesDto } from '../dto/index.js';
import { GroupClassesMapper } from '../mapper/group-classes.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class GroupClassesService extends BaseService {
  constructor(private readonly repo: IGroupClassesRepository = new GroupClassesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateGroupClassesDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return GroupClassesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('GroupClasses record not found');
    return GroupClassesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(GroupClassesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateGroupClassesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('GroupClasses record not found');
    return GroupClassesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('GroupClasses record not found');
    return true;
  }
}
