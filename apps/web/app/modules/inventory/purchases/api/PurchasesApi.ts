import { ApiService } from '@core/api/apiService';

export class PurchasesApi {
  private static endpoint = '/inventory/purchases';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
