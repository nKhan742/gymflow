import { IWorkingHoursModel } from '../model/working-hours.model.js';
import { IWorkingHours } from '../interfaces/working-hours.interface.js';

export class WorkingHoursMapper {
  static toDTO(model: IWorkingHoursModel): IWorkingHours {
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
