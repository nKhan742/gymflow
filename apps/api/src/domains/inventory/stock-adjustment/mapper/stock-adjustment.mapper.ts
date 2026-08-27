import { IStockAdjustmentModel } from '../model/stock-adjustment.model.js';
import { IStockAdjustment } from '../interfaces/stock-adjustment.interface.js';

export class StockAdjustmentMapper {
  static toDTO(model: IStockAdjustmentModel): IStockAdjustment {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Adjustment #${model.adjustmentCode || model.code}`,
      code: model.code || model.adjustmentCode || 'ADJ-001',
      description: model.description,
      adjustmentCode: model.adjustmentCode || 'ADJ-2026-0001',
      productId: model.productId,
      productName: model.productName || 'Adjusted Product',
      sku: model.sku || 'SKU-001',
      adjustmentType: model.adjustmentType || 'CYCLE_COUNT_CORRECTION',
      previousQuantity: model.previousQuantity ?? 0,
      adjustedQuantity: model.adjustedQuantity ?? 0,
      finalQuantity: model.finalQuantity ?? 0,
      reason: model.reason || 'Inventory cycle count correction',
      adjustedDate: model.adjustedDate || model.createdAt,
      adjustedBy: model.adjustedBy || 'General Manager Chloe Bennett',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
