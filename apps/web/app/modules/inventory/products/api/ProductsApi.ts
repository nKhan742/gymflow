import { ApiService } from '@core/api/apiService';

export class ProductsApi {
  private static endpoint = '/inventory/products';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
