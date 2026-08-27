import { IStaffModel } from '../model/staff.model.js';
import { IStaff } from '../interfaces/staff.interface.js';

export class StaffMapper {
  static toDTO(model: IStaffModel): IStaff {
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
