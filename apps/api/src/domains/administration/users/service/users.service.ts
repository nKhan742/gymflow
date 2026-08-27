import { BaseService } from '../../../../shared/base/BaseService.js';
import { IUsersRepository, UsersRepository } from '../repository/users.repository.js';
import { CreateUsersDto, UpdateUsersDto } from '../dto/index.js';
import { UsersMapper } from '../mapper/users.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class UsersService extends BaseService {
  constructor(private readonly repo: IUsersRepository = new UsersRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateUsersDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      email: dto.email || 'user@gymflow.io',
      passwordHash: dto.password || 'default_hash',
      firstName: dto.firstName || 'User',
      lastName: dto.lastName || 'Member',
      role: (dto.role as any) || 'MEMBER',
      permissions: dto.permissions || [],
      branchId: dto.branchId || 'branch_hq_01',
      phone: dto.phone,
      status: (dto.status as any) || 'active',
      isActive: true,
      createdBy,
    });
    return UsersMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Users record not found');
    return UsersMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(UsersMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateUsersDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Users record not found');
    return UsersMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Users record not found');
    return true;
  }
}
