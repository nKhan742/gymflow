import { ApiService } from '@core/api/apiService';

export class StockAdjustmentApi {
  private static endpoint = '/inventory/stock-adjustment';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
