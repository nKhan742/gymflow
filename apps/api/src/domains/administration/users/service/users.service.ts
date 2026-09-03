import { BaseService } from '../../../../shared/base/BaseService.js';
import { IUsersRepository, UsersRepository } from '../repository/users.repository.js';
import { CreateUsersDto, UpdateUsersDto } from '../dto/index.js';
import { UsersMapper } from '../mapper/users.mapper.js';
import { NotFoundException, BadRequestException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';
import bcrypt from 'bcrypt';

export class UsersService extends BaseService {
  constructor(private readonly repo: IUsersRepository = new UsersRepository()) {
    super();
  }

  async create(tenantId: string, dto: any, createdBy?: string) {
    const fullNameParts = (dto.fullName || dto.name || '').trim().split(' ');
    const firstName = dto.firstName || fullNameParts[0] || 'Staff';
    const lastName = dto.lastName || fullNameParts.slice(1).join(' ') || 'User';

    const plainPassword = dto.password || 'password123';
    const passwordHash = dto.passwordHash || (await bcrypt.hash(plainPassword, 10));
    const role = (dto.role as any) || 'TRAINER';

    // Role-based default permissions
    let defaultPermissions: string[] = ['*'];
    if (role === 'TRAINER') {
      defaultPermissions = ['members:members:view', 'gym:staff:view', 'gym:departments:view', 'gym:dashboard:view'];
    } else if (role === 'RECEPTIONIST') {
      defaultPermissions = ['members:members:view', 'members:members:create', 'members:members:update', 'gym:branches:view', 'gym:dashboard:view'];
    } else if (role === 'BRANCH_MANAGER') {
      defaultPermissions = ['gym:branches:view', 'gym:staff:view', 'gym:departments:view', 'members:members:view', 'members:members:create', 'members:members:update', 'gym:dashboard:view'];
    } else if (role === 'NUTRITIONIST') {
      defaultPermissions = ['members:members:view', 'gym:dashboard:view'];
    } else if (role === 'MEMBER') {
      defaultPermissions = ['profile:view'];
    }

    const item = await this.repo.create({
      tenantId,
      name: dto.fullName || dto.name || `${firstName} ${lastName}`,
      code: dto.code || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      email: (dto.email || `user.${Date.now()}@gymflow.io`).toLowerCase().trim(),
      passwordHash,
      firstName,
      lastName,
      role,
      permissions: dto.permissions || defaultPermissions,
      branchId: dto.branchId || 'branch_hq_01',
      phone: dto.phone || '',
      avatar: dto.avatarUrl || dto.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: typeof dto.status === 'string' ? (dto.status.toLowerCase() as any) : 'active',
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
    if (deletedBy && id === deletedBy) {
      throw new BadRequestException('Security policy violation: You cannot delete your own user account.');
    }
    const target = await this.repo.findById(id, tenantId);
    if (!target) throw new NotFoundException('Users record not found');
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Users record not found');
    return true;
  }
}
