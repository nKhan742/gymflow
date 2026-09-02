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

  async create(tenantId: string, dto: any, createdBy?: string) {
    const fullNameParts = (dto.fullName || dto.name || '').trim().split(' ');
    const firstName = dto.firstName || fullNameParts[0] || 'Admin';
    const lastName = dto.lastName || fullNameParts.slice(1).join(' ') || 'User';

    const item = await this.repo.create({
      tenantId,
      name: dto.fullName || dto.name || `${firstName} ${lastName}`,
      code: dto.code || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      email: dto.email || `user.${Date.now()}@gymflow.io`,
      passwordHash: dto.passwordHash || dto.password || 'default_hash_123',
      firstName,
      lastName,
      role: (dto.role as any) || 'SUPER_ADMIN',
      permissions: dto.permissions || ['*'],
      branchId: dto.branchId || 'branch_hq_01',
      phone: dto.phone,
      avatar: dto.avatarUrl || dto.avatar,
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
