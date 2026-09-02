import { IUsersModel } from '../model/users.model.js';
import { IUsers } from '../interfaces/users.interface.js';

export class UsersMapper {
  static toDTO(model: IUsersModel): IUsers {
    const fullName = model.name || `${model.firstName || ''} ${model.lastName || ''}`.trim() || 'User';
    return {
      id: model._id.toString(),
      name: fullName,
      fullName,
      tenantId: model.tenantId,
      branchId: model.branchId,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      role: model.role,
      permissions: model.permissions,
      phone: model.phone || '',
      avatar: model.avatar || '',
      avatarUrl: model.avatar || '',
      isActive: model.isActive,
      status: (model.status || 'active').toUpperCase(),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
