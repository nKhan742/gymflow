import { IInventoryModel } from '../model/inventory.model.js';
import { IInventory } from '../interfaces/inventory.interface.js';

export class InventoryMapper {
  static toDTO(model: IInventoryModel): IInventory {
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
