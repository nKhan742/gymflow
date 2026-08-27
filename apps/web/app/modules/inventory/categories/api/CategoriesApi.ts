import { ApiService } from '@core/api/apiService';

export class CategoriesApi {
  private static endpoint = '/inventory/categories';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
