import { ApiService } from '@core/api/apiService';

export class InventoryReportsApi {
  private static endpoint = '/reports/inventory-reports';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
