import { ApiService } from '@core/api/apiService';

export class TaxesApi {
  private static endpoint = '/finance/taxes';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
