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
    const rolePermissionsMap: Record<string, string[]> = {
      ADMIN: ['*'],
      SUPER_ADMIN: ['*'],
      BRANCH_MANAGER: [
        'gym:branches:view', 'gym:departments:view', 'gym:staff:view', 'gym:staff:create', 'gym:shifts:view', 'gym:holidays:manage',
        'members:members:view', 'members:members:create', 'members:members:update', 'members:attendance:view',
        'scheduling:classes:view', 'scheduling:appointments:view',
        'fitness:workout-plans:view',
        'inventory:equipment:view',
        'analytics:attendance:view'
      ],
      ACCOUNTANT: [
        'finance:payments:view', 'finance:invoices:view', 'finance:invoices:create', 'finance:invoices:sign', 'finance:pos:view', 'finance:salary:view',
        'analytics:revenue:view', 'analytics:reports:export',
        'inventory:products:view', 'inventory:inventory-stock:manage',
        'members:membership-plans:view', 'members:members:view'
      ],
      TRAINER: [
        'fitness:exercise-categories:view', 'fitness:exercise-library:view', 'fitness:workout-templates:view', 'fitness:workout-plans:view', 'fitness:workout-plans:create', 'fitness:fitness-assessment:view',
        'members:members:view', 'members:attendance:view',
        'scheduling:appointments:view', 'scheduling:classes:view',
        'nutrition:diet-plans:view', 'nutrition:meal-library:view'
      ],
      RECEPTIONIST: [
        'members:members:view', 'members:members:create', 'members:members:update', 'members:attendance:view',
        'gym:branches:view', 'gym:shifts:view',
        'scheduling:classes:view'
      ],
      NUTRITIONIST: [
        'nutrition:meal-library:view', 'nutrition:meal-library:create', 'nutrition:diet-plans:view', 'nutrition:diet-plans:create', 'nutrition:nutrition-tracking:view',
        'members:members:view', 'fitness:workout-plans:view'
      ],
      MEMBER: [
        'profile:view',
        'fitness:workout-plans:view',
        'nutrition:diet-plans:view',
        'scheduling:classes:view'
      ]
    };
    const defaultPermissions = rolePermissionsMap[role] || rolePermissionsMap.TRAINER;

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
