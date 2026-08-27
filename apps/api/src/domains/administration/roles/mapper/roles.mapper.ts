import { IRolesModel } from '../model/roles.model.js';
import { IRoles } from '../interfaces/roles.interface.js';

export class RolesMapper {
  static toDTO(model: IRolesModel): IRoles {
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
