import { IProductsModel } from '../model/products.model.js';
import { IProducts } from '../interfaces/products.interface.js';

export class ProductsMapper {
  static toDTO(model: IProductsModel): IProducts {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || 'Gym Product SKU',
      code: model.code || model.sku || 'PRD-001',
      description: model.description,
      sku: model.sku || 'SKU-001',
      barcode: model.barcode || '8901029384',
      category: model.category || 'SUPPLEMENTS',
      price: model.price ?? 0,
      costPrice: model.costPrice ?? 0,
      stockQuantity: model.stockQuantity ?? 0,
      lowStockThreshold: model.lowStockThreshold ?? 10,
      supplier: model.supplier || 'Optimum Nutrition HQ',
      unit: model.unit || 'Unit',
      icon: model.icon || '📦',
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
