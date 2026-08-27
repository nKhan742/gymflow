import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IStockAdjustmentModel, StockAdjustmentModel } from '../model/stock-adjustment.model.js';

export interface IStockAdjustmentRepository extends IBaseRepository<IStockAdjustmentModel> {}

export class StockAdjustmentRepository extends BaseRepository<IStockAdjustmentModel> implements IStockAdjustmentRepository {
  constructor() {
    super(StockAdjustmentModel);
  }
}
