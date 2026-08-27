import { ICouponsModel } from '../model/coupons.model.js';
import { ICoupons } from '../interfaces/coupons.interface.js';

export class CouponsMapper {
  static toDTO(model: ICouponsModel): ICoupons {
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
