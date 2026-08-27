import { ApiService } from '@core/api/apiService';

export class InvoicesApi {
  private static endpoint = '/finance/invoices';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
