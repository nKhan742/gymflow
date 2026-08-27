import { ApiService } from '@core/api/apiService';

export class PaymentsApi {
  private static endpoint = '/finance/payments';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
