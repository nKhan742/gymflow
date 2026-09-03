import { BaseService } from '../../../../shared/base/BaseService.js';
import { IRolesRepository, RolesRepository } from '../repository/roles.repository.js';
import { CreateRolesDto, UpdateRolesDto } from '../dto/index.js';
import { RolesMapper } from '../mapper/roles.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';
import { TenantDatabaseManager } from '../../../../database/tenant-database.manager.js';

export class RolesService extends BaseService {
  constructor(private readonly repo: IRolesRepository = new RolesRepository()) {
    super();
  }

  private async getRoleHoldersCounts(tenantId: string): Promise<Map<string, number>> {
    const countMap = new Map<string, number>();
    try {
      const cleanDbName = tenantId.startsWith('tenant_gymflow_')
        ? tenantId.replace(/^tenant_/, '')
        : tenantId.startsWith('tenant_')
        ? `gymflow_db_${tenantId.replace(/^tenant_/, '')}`
        : tenantId;

      const tenantModels = TenantDatabaseManager.getTenantModels(cleanDbName);
      const users = tenantModels.Users ? await tenantModels.Users.find({ isDeleted: false }, { email: 1, role: 1 }).lean() : [];
      const staff = tenantModels.Staff ? await tenantModels.Staff.find({ isDeleted: false }, { email: 1, role: 1 }).lean() : [];

      const roleHoldersMap = new Map<string, Set<string>>();
      for (const u of users) {
        if (u.role) {
          const key = u.role.toUpperCase().trim();
          if (!roleHoldersMap.has(key)) roleHoldersMap.set(key, new Set());
          roleHoldersMap.get(key)!.add((u.email || u._id.toString()).toLowerCase().trim());
        }
      }
      for (const s of staff) {
        if (s.role) {
          const key = s.role.toUpperCase().trim();
          if (!roleHoldersMap.has(key)) roleHoldersMap.set(key, new Set());
          roleHoldersMap.get(key)!.add((s.email || s._id.toString()).toLowerCase().trim());
        }
      }

      for (const [key, set] of roleHoldersMap.entries()) {
        countMap.set(key, set.size);
      }
    } catch {}
    return countMap;
  }

  async create(tenantId: string, dto: any, createdBy?: string) {
    const roleName = dto.roleName || dto.name;
    const roleKey = dto.roleKey || dto.code;
    const item = await this.repo.create({
      tenantId,
      name: roleName,
      roleName,
      code: roleKey,
      roleKey,
      description: dto.description,
      hierarchyTier: dto.hierarchyTier ?? 3,
      isSystemRole: !!dto.isSystemRole,
      assignedUsersCount: dto.assignedUsersCount || 0,
      permissionModulesCount: dto.permissionModulesCount || (dto.permissionsList || []).length,
      permissionsList: dto.permissionsList || dto.permissions || [],
      permissions: dto.permissions || dto.permissionsList || [],
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return RolesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    let item = await this.repo.findById(id, tenantId);
    if (!item) {
      const altTenantId = tenantId.startsWith('tenant_gymflow_db_')
        ? tenantId.replace(/^tenant_gymflow_db_/, 'tenant_')
        : `tenant_gymflow_db_${tenantId.replace(/^tenant_/, '')}`;
      item = await this.repo.findById(id, altTenantId);
    }
    if (!item) throw new NotFoundException('Roles record not found');
    const dto = RolesMapper.toDTO(item);
    const countMap = await this.getRoleHoldersCounts(tenantId);
    const key = (dto.roleKey || dto.code || dto.name || '').toUpperCase().trim();
    const dynamicCount = countMap.get(key);
    if (dynamicCount !== undefined) {
      dto.assignedUsersCount = dynamicCount;
      if (item.assignedUsersCount !== dynamicCount) {
        this.repo.updateById(item._id, { assignedUsersCount: dynamicCount }, tenantId).catch(() => null);
      }
    }
    return dto;
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    let result = await this.repo.find({ tenantId }, pagination);
    if (!result.items || result.items.length === 0) {
      const altTenantId = tenantId.startsWith('tenant_gymflow_db_')
        ? tenantId.replace(/^tenant_gymflow_db_/, 'tenant_')
        : `tenant_gymflow_db_${tenantId.replace(/^tenant_/, '')}`;
      const altResult = await this.repo.find({ tenantId: altTenantId }, pagination);
      if (altResult.items && altResult.items.length > 0) {
        result = altResult;
      }
    }
    const countMap = await this.getRoleHoldersCounts(tenantId);

    const items = result.items.map((item) => {
      const dto = RolesMapper.toDTO(item);
      const key = (dto.roleKey || dto.code || dto.name || '').toUpperCase().trim();
      const dynamicCount = countMap.get(key);
      if (dynamicCount !== undefined) {
        dto.assignedUsersCount = dynamicCount;
        if (item.assignedUsersCount !== dynamicCount) {
          this.repo.updateById(item._id, { assignedUsersCount: dynamicCount }, tenantId).catch(() => null);
        }
      }
      return dto;
    });

    return {
      ...result,
    };
  }

  async update(id: string, tenantId: string, dto: any, updatedBy?: string) {
    const payload: any = { ...dto, updatedBy };
    if (dto.roleName || dto.name) {
      payload.name = dto.roleName || dto.name;
      payload.roleName = dto.roleName || dto.name;
    }
    if (dto.roleKey || dto.code) {
      payload.code = dto.roleKey || dto.code;
      payload.roleKey = dto.roleKey || dto.code;
    }
    if (dto.permissionsList || dto.permissions) {
      payload.permissionsList = dto.permissionsList || dto.permissions;
      payload.permissions = dto.permissions || dto.permissionsList;
    }
    const item = await this.repo.updateById(id, payload, tenantId);
    if (!item) throw new NotFoundException('Roles record not found');

    if (payload.permissionsList || payload.permissions) {
      try {
        const cleanDbName = tenantId.startsWith('tenant_gymflow_')
          ? tenantId.replace(/^tenant_/, '')
          : tenantId.startsWith('tenant_')
          ? `gymflow_db_${tenantId.replace(/^tenant_/, '')}`
          : tenantId;
        const tenantModels = TenantDatabaseManager.getTenantModels(cleanDbName);
        const roleKey = item.roleKey || item.code;
        if (roleKey && tenantModels.Users) {
          const perms = payload.permissionsList || payload.permissions;
          await tenantModels.Users.updateMany(
            { role: roleKey, isDeleted: false },
            { $set: { permissions: perms } }
          );
        }
      } catch {}
    }

    return RolesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Roles record not found');
    return true;
  }
}
