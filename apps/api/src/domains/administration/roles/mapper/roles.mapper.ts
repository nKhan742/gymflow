import { IRolesModel } from '../model/roles.model.js';
import { IRoles } from '../interfaces/roles.interface.js';

export class RolesMapper {
  static toDTO(model: IRolesModel): any {
    const roleName = model.roleName || model.name;
    const roleKey = model.roleKey || model.code || (model.name || '').toUpperCase().replace(/[^A-Z0-9]+/g, '_');
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: roleName,
      roleName,
      code: roleKey,
      roleKey,
      description: model.description || '',
      hierarchyTier: model.hierarchyTier || 3,
      isSystemRole: !!model.isSystemRole,
      assignedUsersCount: model.assignedUsersCount || 0,
      permissionModulesCount: model.permissionModulesCount || (model.permissionsList || model.permissions || []).length,
      permissionsList: model.permissionsList || model.permissions || [],
      status: (model.status || 'ACTIVE').toUpperCase(),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
