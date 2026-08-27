import { IPosModel } from '../model/pos.model.js';
import { IPos } from '../interfaces/pos.interface.js';

export class PosMapper {
  static toDTO(model: IPosModel): IPos {
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
