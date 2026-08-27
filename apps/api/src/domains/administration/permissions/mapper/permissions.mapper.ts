import { IPermissionsModel } from '../model/permissions.model.js';
import { IPermissions } from '../interfaces/permissions.interface.js';

export class PermissionsMapper {
  static toDTO(model: IPermissionsModel): IPermissions {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
