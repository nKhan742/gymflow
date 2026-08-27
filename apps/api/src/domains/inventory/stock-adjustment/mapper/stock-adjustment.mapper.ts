import { IStockAdjustmentModel } from '../model/stock-adjustment.model.js';
import { IStockAdjustment } from '../interfaces/stock-adjustment.interface.js';

export class StockAdjustmentMapper {
  static toDTO(model: IStockAdjustmentModel): IStockAdjustment {
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
