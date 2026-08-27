import { ApiService } from '@core/api/apiService';

export class SuppliersApi {
  private static endpoint = '/inventory/suppliers';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
