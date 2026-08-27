import { IProductsModel } from '../model/products.model.js';
import { IProducts } from '../interfaces/products.interface.js';

export class ProductsMapper {
  static toDTO(model: IProductsModel): IProducts {
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
