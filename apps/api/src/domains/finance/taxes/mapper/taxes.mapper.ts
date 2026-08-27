import { ITaxesModel } from '../model/taxes.model.js';
import { ITaxes } from '../interfaces/taxes.interface.js';

export class TaxesMapper {
  static toDTO(model: ITaxesModel): ITaxes {
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
