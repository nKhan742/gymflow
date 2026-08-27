import { IMaintenanceModel } from '../model/maintenance.model.js';
import { IMaintenance } from '../interfaces/maintenance.interface.js';

export class MaintenanceMapper {
  static toDTO(model: IMaintenanceModel): IMaintenance {
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
