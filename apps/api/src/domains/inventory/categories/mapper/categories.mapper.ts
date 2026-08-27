import { ICategoriesModel } from '../model/categories.model.js';
import { ICategories } from '../interfaces/categories.interface.js';

export class CategoriesMapper {
  static toDTO(model: ICategoriesModel): ICategories {
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
