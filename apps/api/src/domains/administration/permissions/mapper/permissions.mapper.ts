import { IPermissionsModel } from '../model/permissions.model.js';
import { IPermissions } from '../interfaces/permissions.interface.js';

export class PermissionsMapper {
  static toDTO(model: any): any {
    const permName = model.permissionName || model.name;
    const permCode = model.permissionCode || model.code;
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: permName,
      permissionName: permName,
      code: permCode,
      permissionCode: permCode,
      moduleDomain: model.moduleDomain || 'System Operations',
      actionType: model.actionType || 'READ',
      description: model.description || '',
      riskLevel: model.riskLevel || 'LOW',
      grantedRolesCount: model.grantedRolesCount || 1,
      isSystemProtected: !!model.isSystemProtected,
      iconAvatarUrl: model.iconAvatarUrl,
      status: (model.status || 'ACTIVE').toUpperCase(),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
