import { IEquipmentModel } from '../model/equipment.model.js';
import { IEquipment } from '../interfaces/equipment.interface.js';

export class EquipmentMapper {
  static toDTO(model: IEquipmentModel): IEquipment {
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
