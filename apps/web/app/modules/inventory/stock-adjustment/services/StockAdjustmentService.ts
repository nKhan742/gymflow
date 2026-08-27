import { StockAdjustmentApi } from '../api';

export class StockAdjustmentService {
  static async getList() {
    return StockAdjustmentApi.getAll();
  }
}
