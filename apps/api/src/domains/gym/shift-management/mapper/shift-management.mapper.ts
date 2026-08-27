import { IShiftManagementModel } from '../model/shift-management.model.js';
import { IShiftManagement } from '../interfaces/shift-management.interface.js';

export class ShiftManagementMapper {
  static toDTO(model: IShiftManagementModel): IShiftManagement {
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
