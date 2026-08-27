import { IInventoryModel } from '../model/inventory.model.js';
import { IInventory } from '../interfaces/inventory.interface.js';

export class InventoryMapper {
  static toDTO(model: IInventoryModel): IInventory {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Stock for ${model.productName || model.sku}`,
      code: model.code || model.stockCode || 'STK-001',
      description: model.description,
      stockCode: model.stockCode || 'STK-001',
      productId: model.productId,
      productName: model.productName || 'Gym Inventory Item',
      sku: model.sku || 'SKU-001',
      category: model.category || 'SUPPLEMENTS',
      quantityOnHand: model.quantityOnHand ?? 0,
      quantityReserved: model.quantityReserved ?? 0,
      quantityAvailable: model.quantityAvailable ?? 0,
      reorderLevel: model.reorderLevel ?? 10,
      reorderQuantity: model.reorderQuantity ?? 24,
      warehouseLocation: model.warehouseLocation || 'Stockroom Shelf A-01',
      lastRestockedDate: model.lastRestockedDate || model.createdAt,
      stockHealth: model.stockHealth || 'OPTIMAL',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
