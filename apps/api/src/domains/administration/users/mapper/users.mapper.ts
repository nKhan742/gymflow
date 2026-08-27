import { IUsersModel } from '../model/users.model.js';
import { IUsers } from '../interfaces/users.interface.js';

export class UsersMapper {
  static toDTO(model: IUsersModel): IUsers {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      role: model.role,
      permissions: model.permissions,
      phone: model.phone,
      avatar: model.avatar,
      isActive: model.isActive,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
