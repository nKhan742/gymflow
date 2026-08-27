import { ApiService } from '@core/api/apiService';

export class InventoryStockApi {
  private static endpoint = '/inventory/inventory-stock';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
