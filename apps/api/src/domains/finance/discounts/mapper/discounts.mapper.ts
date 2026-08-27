import { IDiscountsModel } from '../model/discounts.model.js';
import { IDiscounts } from '../interfaces/discounts.interface.js';

export class DiscountsMapper {
  static toDTO(model: IDiscountsModel): IDiscounts {
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
