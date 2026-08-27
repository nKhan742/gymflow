import { ApiService } from '@core/api/apiService';

export class DiscountsApi {
  private static endpoint = '/finance/discounts';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
