import { IPurchasesModel } from '../model/purchases.model.js';
import { IPurchases } from '../interfaces/purchases.interface.js';

export class PurchasesMapper {
  static toDTO(model: IPurchasesModel): IPurchases {
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
