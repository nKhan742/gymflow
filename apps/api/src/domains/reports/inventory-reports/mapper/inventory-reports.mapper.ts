import { IInventoryReportsModel } from '../model/inventory-reports.model.js';
import { IInventoryReports } from '../interfaces/inventory-reports.interface.js';

export class InventoryReportsMapper {
  static toDTO(model: IInventoryReportsModel): IInventoryReports {
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
