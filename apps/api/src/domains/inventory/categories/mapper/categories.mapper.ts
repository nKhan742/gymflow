import { ICategoriesModel } from '../model/categories.model.js';
import { ICategories } from '../interfaces/categories.interface.js';

export class CategoriesMapper {
  static toDTO(model: ICategoriesModel): ICategories {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || 'Category',
      code: model.code || model.categoryCode || 'CAT-001',
      categoryCode: model.categoryCode || 'CAT-001',
      slug: model.slug || 'category',
      description: model.description,
      icon: model.icon || '📦',
      productCount: model.productCount ?? 0,
      taxRate: model.taxRate ?? 10,
      isDisplayedInPOS: model.isDisplayedInPOS ?? true,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
