import { IChangePasswordModel } from '../model/change-password.model.js';
import { IChangePassword } from '../interfaces/change-password.interface.js';

export class ChangePasswordMapper {
  static toDTO(model: IChangePasswordModel): IChangePassword {
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
